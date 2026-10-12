import { NextResponse } from 'next/server';

const artisans = [
  { id: 1, name: "Baba Electrician Ikeja", skill: "Generator Repair", status: "Online", rating: "4.8 ⭐", location: "Ikeja, Lagos" },
  { id: 2, name: "Mama Plumber Surulere", skill: "Pipe Leakage", status: "Offline", rating: "4.9 ⭐", location: "Surulere, Lagos" },
  { id: 3, name: "Engr. Kenneth Lekki", skill: "Solar & Inverter", status: "Online", rating: "5.0 ⭐", location: "Lekki, Lagos" }
];

export async function GET() {
  return NextResponse.json(artisans);
}
