import { NextRequest, NextResponse } from 'next/server';
import { orderImaging } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { caseId, modality } = await req.json();
  const message = orderImaging(caseId, modality);
  return NextResponse.json({ message });
}
