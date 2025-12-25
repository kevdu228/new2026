import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

const makeToken = (len = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const arr = new Uint8Array(len);
  // Node has global crypto
  crypto.getRandomValues(arr as any);
  return Array.from(arr).map((n) => chars[n % chars.length]).join('');
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url;
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'missing url' }, { status: 400 });
    }

    let token = '';
    let attempts = 0;
    while (attempts < 10) {
      token = makeToken(6);
      const { data, error } = await supabase
        .from('shortlinks')
        .insert([{ token, url }])
        .select();

      if (error) {
        if (error.code === '23505') { // unique constraint violation
          attempts++;
          continue;
        }
        throw error;
      }
      return NextResponse.json({ token });
    }
    return NextResponse.json({ error: 'failed to generate unique token' }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}