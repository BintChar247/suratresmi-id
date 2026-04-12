import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function GET(): Promise<NextResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
  }

  try {
    const anthropic = new Anthropic({ apiKey: key });
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "ok" in one word.' }],
    });
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ ok: true, response: text, keyPrefix: key.slice(0, 12) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
