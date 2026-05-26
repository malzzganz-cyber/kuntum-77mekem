import { NextResponse } from 'next/server';
import axios from 'axios';
import { SETTINGS } from '@/lib/settings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const provider_id = searchParams.get('provider_id');
  
  if (!country || !provider_id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const res = await axios.get(`${SETTINGS.BASE_URL}/v2/operators?country=${country}&provider_id=${provider_id}`, {
      headers: {
        "x-apikey": SETTINGS.API_KEY,
        "Accept": "application/json"
      }
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
