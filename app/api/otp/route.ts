import { NextResponse } from 'next/server';
import axios from 'axios';
import { SETTINGS } from '@/lib/settings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const order_id = searchParams.get('order_id');
  const status = searchParams.get('status');
  
  if (!order_id) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  try {
    let url = `${SETTINGS.BASE_URL}/v1/orders/get_status?order_id=${order_id}`;
    if (status === 'cancel') {
        url = `${SETTINGS.BASE_URL}/v1/orders/set_status?order_id=${order_id}&status=cancel`;
    }

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
