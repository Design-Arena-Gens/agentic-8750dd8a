import { NextRequest, NextResponse } from 'next/server';
import { CASES, TOPICS_LABEL } from '@/data/cases';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topicLabel = searchParams.get('topic') ?? '';
  const topicKey = Object.entries(TOPICS_LABEL).find(([_, label]) => label === topicLabel)?.[0];
  const filtered = topicKey ? CASES.filter(c => c.topic === topicKey) : CASES;
  const items = filtered.length ? filtered : CASES;
  const idx = Math.floor(Math.random() * items.length);
  const c = items[idx];
  return NextResponse.json({
    case: {
      id: c.id,
      topic: c.topic,
      topicFa: c.topicFa,
      level: c.level,
      title: c.title,
      labOptions: c.labOptions,
      imagingOptions: c.imagingOptions,
    }
  });
}
