import { NextResponse } from 'next/server';
import axios from 'axios';
import { SETTINGS } from '@/lib/settings';

export async function GET() {
  try {
    const res = await axios.get(`${SETTINGS.BASE_URL}/v1/user/balance`, {
      headers: {
        "x-apikey": SETTINGS.API_KEY,
        "Accept": "application/json"
      }
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.response?.data || error.message }, { status: 500 });
  }
}
