
description: Defines database design, Prisma schema management, data integrity and database operations for X3M Ideas Agency Life Simulation. Use when creating, modifying, querying or reviewing database structures and records.
---

# Database Management Skill

## 1. Project Context

Manage the data systems for X3M Ideas Agency Life Simulation.

Use PostgreSQL as the database, Prisma as the ORM and Supabase for managed infrastructure and authentication.

Use the PRD and GDD as the primary references. Keep the database structure aligned with the actual game requirements.

## 2. Core Database Principles

- Use PostgreSQL for persistent game data.
- Use Prisma for database access and schema management.
- Keep the schema simple, organised and scalable.
- Give each entity a clear purpose.
- Avoid unnecessary tables and duplicated records.
- Use appropriate relationships between entities.
- Validate data before writing to the database.
- Persist important player progress.
- Never expose database credentials to the client.

## 3. Core Data Entities

Organise the database around the game's main systems.

Initial entities should cover:

| System | Data entities |
|---|---|
| Players | Player, PlayerProfile |
| Employment | Employee, Department, JobRole, SalaryBand |
| Career | CareerHistory, Promotion, PerformanceRecord |
| Recruitment | RecruitmentRecord, SalaryNegotiation |
| Briefs | Brief, BriefAssignment, BriefSubmission, Evaluation |
| Economy | Wallet, Transaction, Expense, Asset, Inventory |
| HR | HRRecord, Warning, Query, DisciplinaryAction |
| Office | NPC, OfficeLocation, NPCSchedule, Interaction |
| Relationships | Relationship, Conversation |
| Events | OfficeEvent, EventParticipation, Achievement |
| Game time | GameClock, ScheduledEvent |

These are proposed entities, not a requirement to create every table immediately. Introduce them as their corresponding features are implemented.

## 4. Data Relationships

Maintain clear relationships between records.

Examples:

- A player has one profile.
- A player can have employment and career history.
- An employee belongs to a department and holds a job role.
- A player can receive multiple brief assignments.
- A brief can have multiple submissions.
- Evaluations belong to specific submissions.
- A player has financial records and transactions.
- A player can own multiple assets.
- NPCs belong to departments and have office schedules.
- Players can participate in multiple office events.

Use foreign keys and appropriate constraints to maintain referential integrity.

## 5. Player and Employment Data

Keep player identity separate from employment information.

Player profile data should include character details and customisation.

Employment data should include:
- Department.
- Job role.
- Designation.
- Salary.
- Employment status.
- Start date.
- Employment history.

Every player starts at entry level.

Career changes must update employment records without erasing previous designations or salary history.

## 6. Financial Data Management

Financial records require strict consistency.

Store and track:
- Current balance.
- Salary payments.
- Bonuses.
- Expenses.
- Purchases.
- Asset ownership.
- Transaction history.

Rules:

- Use a consistent numeric representation for virtual currency.
- Validate available funds before purchases.
- Process related financial updates in database transactions.
- Prevent duplicate salary payments and purchases.
- Record transaction type, amount, timestamp and related reference.
- Never allow direct client-side balance updates.
- Preserve historical financial transactions.

Calculate net worth from the appropriate financial and asset records rather than maintaining conflicting copies of the same information.

## 7. Briefs and Evaluation Data

Store brief content separately from player assignments and submissions.

Each brief should support:
- Category.
- Department eligibility.
- Difficulty.
- Instructions.
- Deadline configuration.
- Answer format.
- Evaluation criteria.
- Correct answers or marking rubric.
- Version.

Each submission should retain:
- Player.
- Assigned brief.
- Submitted answer.
- Submission timestamp.
- Evaluation result.
- Score.
- Feedback.
- Completion status.

Preserve the rubric and brief version used for each evaluation so historical scores remain explainable.

## 8. Game Time and Scheduling

The server-controlled game clock is authoritative.

Store the configuration required to calculate:
- Game time.
- Time acceleration.
- Salary payment dates.
- Brief deadlines.
- NPC schedules.
- Office events.
- Recurring expenses.

Do not rely on browser timestamps for game outcomes.

Store timestamps consistently and apply the configured game calendar when calculating deadlines and scheduled activities.

## 9. Prisma Schema Management

- Define database models in the Prisma schema.
- Use clear, consistent model and field names.
- Define primary keys and foreign keys.
- Add unique constraints where necessary.
- Use indexes for frequently queried fields.
- Define appropriate deletion behaviour for related records.
- Use migrations to manage schema changes.
- Do not edit the production database structure manually.

Before creating a migration:
1. Inspect the existing schema.
2. Identify affected models and relationships.
3. Check existing records for compatibility.
4. Make the smallest necessary schema change.
5. Apply and verify the migration.

Never reset or drop a database containing important player data without explicit approval.

## 10. Security and Access Control

- Use Supabase Auth for player authentication.
- Associate player-owned records with the authenticated player.
- Validate record ownership on the server.
- Prevent players from accessing or modifying another player's data.
- Keep database credentials and service-role keys server-side.
- Apply appropriate database access policies where Supabase access is used.
- Never trust client-submitted player IDs or financial values.

## 11. Database Performance

Prioritise practical optimisation.

- Index frequently queried foreign keys and filter fields where appropriate.
- Avoid unnecessary database queries.
- Use pagination for growing record collections.
- Select only the fields required by each operation.
- Avoid loading entire player histories when a summary is sufficient.
- Monitor slow queries before introducing optimisation complexity.

Use PostgreSQL with pgvector for RAG knowledge retrieval when that feature is implemented.

## 12. Implementation Rules

When working on database features:

1. Inspect the existing Prisma schema.
2. Identify the relevant game entities.
3. Check existing relationships before adding new ones.
4. Make only the required schema changes.
5. Generate and review the migration.
6. Test database operations.
7. Verify data integrity.
8. Report changed models, migrations and outstanding issues.

Do not create speculative models for features that have not been approved or scheduled for implementation.

## 13. Testing Requirements

Test:
- Record creation and updates.
- Relationship constraints.
- Unique constraints.
- Player data isolation.
- Transaction consistency.
- Duplicate transaction prevention.
- Migration success.
- Data persistence.
- Invalid and missing values.
- Deletion behaviour.

Use test data for development. Do not test destructive operations against important player records.
## Office and Organisational Structure

Support the following office units:
- BU1
- BU2
- BU3
- Finance
- HR

Each office unit must be stored as an organisational record with:
- Unique ID.
- Name.
- Unit type (Business Unit or Functional Department).
- Office location.
- Assigned employees.
- Assigned NPCs.

Employees and NPCs should be linked to their respective office units through database relationships.

**Primary rule:** The database must preserve accurate player progress and game history. Every important change must be validated, traceable and consistent.