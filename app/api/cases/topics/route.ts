import { NextResponse } from 'next/server';
import { TOPICS_LABEL, CASES } from '@/data/cases';

export async function GET() {
  const topics = Array.from(new Set(CASES.map(c => c.topic))).map(key => TOPICS_LABEL[key] ?? key);
  return NextResponse.json({ topics });
}
