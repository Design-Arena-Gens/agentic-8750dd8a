import { NextRequest, NextResponse } from 'next/server';
import { respondToMessage } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { caseId, messages } = await req.json();
  const message = respondToMessage(caseId, messages);
  return NextResponse.json({ message });
}
