import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

export interface WalletTransactionParams {
  walletId: string;
  amount: number;
  type: TransactionType;
  description: string;
  referenceId?: string;
  idempotencyKey?: string;
}

export interface PurchaseItemParams {
  walletId: string;
  itemId: string;
}

export class EconomyService {
  /**
   * Process an authoritative wallet transaction within an isolated Prisma database transaction.
   * Prevents overdrafts and maintains an immutable audit ledger.
   */
  public static async executeTransaction(params: WalletTransactionParams) {
    const { walletId, amount, type, description, referenceId, idempotencyKey } = params;

    return await prisma.$transaction(async (tx) => {
      // 1. Idempotency check if key provided
      if (idempotencyKey) {
        const existingTx = await tx.transaction.findFirst({
          where: {
            walletId,
            referenceId: idempotencyKey
          }
        });
        if (existingTx) {
          console.warn(`[EconomyService] Idempotency hit for key ${idempotencyKey}. Returning existing transaction.`);
          return { success: true, transaction: existingTx, idempotencyHit: true };
        }
      }

      // 2. Fetch current wallet state with lock
      const wallet = await tx.wallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet) {
        throw new Error(`Wallet not found: ${walletId}`);
      }

      // 3. Balance verification for negative / debit mutations
      const isDebit = type === TransactionType.MARKETPLACE_PURCHASE || type === TransactionType.RECURRING_EXPENSE || amount < 0;
      const mutationAmount = isDebit ? -Math.abs(amount) : Math.abs(amount);

      if (isDebit && wallet.balance < Math.abs(mutationAmount)) {
        throw new Error(
          `Insufficient funds: current balance ₦${wallet.balance.toLocaleString()}, required ₦${Math.abs(mutationAmount).toLocaleString()}`
        );
      }

      const updatedBalance = wallet.balance + mutationAmount;

      // 4. Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: walletId },
        data: {
          balance: updatedBalance,
          updatedAt: new Date()
        }
      });

      // 5. Append immutable transaction ledger entry
      const ledgerEntry = await tx.transaction.create({
        data: {
          walletId,
          amount: Math.abs(mutationAmount),
          balanceAfter: updatedBalance,
          type,
          description,
          referenceId: idempotencyKey || referenceId
        }
      });

      return {
        success: true,
        transaction: ledgerEntry,
        newBalance: updatedWallet.balance,
        idempotencyHit: false
      };
    });
  }

  /**
   * Process monthly or weekly salary disbursement for an employee.
   */
  public static async disburseSalary(employeeId: string, monthNumber: number) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        player: {
          include: { wallet: true }
        },
        jobRole: {
          include: { salaryBand: true }
        }
      }
    });

    if (!employee || !employee.player.wallet) {
      throw new Error(`Employee or player wallet not found for id: ${employeeId}`);
    }

    const baseSalary = employee.currentSalary || employee.jobRole.salaryBand.minSalary;
    const idempotencyKey = `salary_${employeeId}_month_${monthNumber}`;

    return await this.executeTransaction({
      walletId: employee.player.wallet.id,
      amount: baseSalary,
      type: 'SALARY',
      description: `Monthly Salary - ${employee.jobRole.title} (Month ${monthNumber})`,
      idempotencyKey
    });
  }

  /**
   * Purchase a lifestyle or career item, deducting funds and adding to player's inventory.
   */
  public static async purchaseLifestyleItem(params: PurchaseItemParams) {
    const { walletId, itemId } = params;

    return await prisma.$transaction(async (tx) => {
      const item = await tx.lifestyleItem.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        throw new Error(`Lifestyle item not found: ${itemId}`);
      }

      // Check if already owned
      const existingInventory = await tx.inventoryItem.findFirst({
        where: {
          walletId,
          itemId
        }
      });

      if (existingInventory) {
        throw new Error(`Item "${item.name}" is already owned.`);
      }

      // Check wallet balance
      const wallet = await tx.wallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet || wallet.balance < item.price) {
        throw new Error(`Insufficient funds to purchase "${item.name}". Price: ₦${item.price.toLocaleString()}`);
      }

      // Debit wallet
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: wallet.balance - item.price }
      });

      // Record transaction
      await tx.transaction.create({
        data: {
          walletId,
          amount: item.price,
          balanceAfter: wallet.balance - item.price,
          type: TransactionType.MARKETPLACE_PURCHASE,
          description: `Purchased lifestyle item: ${item.name}`,
          referenceId: `purchase_${item.id}_${Date.now()}`
        }
      });

      // Add to inventory
      const inventory = await tx.inventoryItem.create({
        data: {
          walletId,
          itemId: item.id
        }
      });

      return {
        success: true,
        purchasedItem: item,
        inventoryRecord: inventory
      };
    });
  }
}
