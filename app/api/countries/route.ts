import { NextResponse } from 'next/server';
import axios from 'axios';
import { SETTINGS } from '@/lib/settings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service_id = searchParams.get('service_id');
  
  if (!service_id) {
    return NextResponse.json({ error: "Missing service_id" }, { status: 400 });
  }

  try {
    const res = await axios.get(`${SETTINGS.BASE_URL}/v2/countries?service_id=${service_id}`, {
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
