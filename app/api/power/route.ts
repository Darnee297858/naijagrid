import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || 'Enugu';
  const lga = searchParams.get('lga') || 'Enugu North';

  // Sample dynamic local grid data mapped across Nigeria
  const discoMap: Record<string, string> = {
    Enugu: 'EEDC (Enugu Electricity Distribution Company)',
    Lagos: 'EKEDC / IKEDC',
    Abuja: 'AEDC (Abuja Electricity)',
    Rivers: 'PHED (Port Harcourt Electricity)',
    Oyo: 'IBEDC (Ibadan Electricity)',
    Kano: 'KEDCO (Kano Electricity)',
    Kaduna: 'KAEDCO (Kaduna Electricity)',
    Edo: 'BEDC (Benin Electricity)'
  };

  const gridData = {
    location: `${lga}, ${state} State`,
    disco: discoMap[state] || 'Regional DisCo',
    band: 'Band A (20+ Hrs Guaranteed Daily)',
    currentStatus: 'LIGHT_DEY',
    voltageQuality: '220V Normal',
    lastUpdated: 'Just now',
    reportsCountToday: 142,
    feederStatus: 'Operational - No Reported Trip',
    upTime24h: '18.5 Hours'
  };

  return NextResponse.json(gridData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: `Status '${body.status}' recorded for ${body.street || 'your area'}, ${body.state || 'Nigeria'}!`,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record report' }, { status: 500 });
  }
}