import { NextRequest, NextResponse } from 'next/server';
import { orderLab } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { caseId, test } = await req.json();
  const message = orderLab(caseId, test);
  return NextResponse.json({ message });
}
