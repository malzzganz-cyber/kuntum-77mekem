import { NextResponse } from 'next/server';
import axios from 'axios';
import { SETTINGS } from '@/lib/settings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number_id = searchParams.get('number_id');
  const provider_id = searchParams.get('provider_id');
  const operator_id = searchParams.get('operator_id');
  
  if (!number_id || !provider_id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  let url = `${SETTINGS.BASE_URL}/v2/orders?number_id=${number_id}&provider_id=${provider_id}`;
  if (operator_id && operator_id !== 'any') {
    url += `&operator_id=${operator_id}`;
  }

  try {
    const res = await axios.get(url, {
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
