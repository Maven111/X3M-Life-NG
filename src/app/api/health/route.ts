import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    product: 'X3M Ideas: Agency Life Simulation',
    framework: 'Next.js App Router (TypeScript)',
    database: 'Prisma + PostgreSQL (Supabase)',
    aiService: 'Gemini 2.5 Flash',
    timestamp: new Date().toISOString()
  });
}

