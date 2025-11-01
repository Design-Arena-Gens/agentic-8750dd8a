import { NextRequest, NextResponse } from 'next/server';
import { evaluate } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { caseId, differentials, plan, meds } = await req.json();
  const result = evaluate(caseId, differentials ?? '', plan ?? '', meds ?? '');
  return NextResponse.json({ result });
}
