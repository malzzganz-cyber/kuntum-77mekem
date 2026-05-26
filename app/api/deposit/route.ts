import { NextResponse } from 'next/server';
import axios from 'axios';
import { SETTINGS } from '@/lib/settings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // create, status, cancel
  const amount = searchParams.get('amount');
  const deposit_id = searchParams.get('deposit_id');

  try {
    let url = "";
    if (action === "create" && amount) {
        url = `${SETTINGS.BASE_URL}/v2/deposit/create?amount=${amount}&payment_id=qris`;
    } else if (action === "status" && deposit_id) {
        url = `${SETTINGS.BASE_URL}/v2/deposit/get_status?deposit_id=${deposit_id}`;
    } else if (action === "cancel" && deposit_id) {
        url = `${SETTINGS.BASE_URL}/v1/deposit/cancel?deposit_id=${deposit_id}`;
    } else {
        return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
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
