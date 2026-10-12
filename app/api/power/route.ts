import { NextResponse } from 'next/server';

let currentPowerStatus = {
  status: 'unknown',
  message: 'No status reported yet',
  updatedAt: new Date().toISOString()
};

export async function GET() {
  return NextResponse.json(currentPowerStatus);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status } = body;

    if (status !== 'on' && status !== 'off') {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    currentPowerStatus = {
      status,
      message: status === 'on' ? '💡 Light Dey Now' : '🌑 Light Don Go',
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: currentPowerStatus });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
