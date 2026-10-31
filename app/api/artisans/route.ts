import { NextResponse } from 'next/server';

const detailedArtisans = [
  {
    id: 1,
    name: "Engr. Chukwudi Okafor",
    specialty: "Solar & Inverter System Design",
    verificationLevel: "Verified Certified Master",
    experience: "8 Years",
    rating: "4.95 ⭐ (88 Reviews)",
    location: "Ogui Road, Enugu Urban, Enugu State",
    badge: "5KVA - 20KVA Specialist",
    status: "Available for Emergency",
    responseTime: "< 30 Mins",
    completedJobs: 142
  },
  {
    id: 2,
    name: "Lagos Island Electrical & DisCo Line Ops",
    specialty: "3-Phase Industrial & Residential Wiring",
    verificationLevel: "COREN Registered Partner",
    experience: "12 Years",
    rating: "4.88 ⭐ (112 Reviews)",
    location: "Sura / Victoria Island, Lagos State",
    badge: "Prepaid Meter & DisCo Panel Expert",
    status: "On Job (Available 4 PM)",
    responseTime: "< 1 Hour",
    completedJobs: 310
  },
  {
    id: 3,
    name: "Alhaji Bello Generator Care",
    specialty: "Mikano, Marapco & Heavy Diesel Gensets",
    verificationLevel: "Corporate Verified",
    experience: "15 Years",
    rating: "4.90 ⭐ (74 Reviews)",
    location: "Central Business District, Abuja",
    badge: "ATS & Changeover Switch Expert",
    status: "Available Now",
    responseTime: "< 20 Mins",
    completedJobs: 205
  },
  {
    id: 4,
    name: "Engr. Patience Akpan",
    specialty: "Inverter Battery Diagnostics & Solar Repairs",
    verificationLevel: "Certified Renewable Specialist",
    experience: "6 Years",
    rating: "4.92 ⭐ (63 Reviews)",
    location: "GRA Phase 2, Port Harcourt, Rivers State",
    badge: "Lithium-Ion & Gel Battery Tech",
    status: "Available Now",
    responseTime: "< 45 Mins",
    completedJobs: 98
  }
];

export async function GET() {
  return NextResponse.json(detailedArtisans);
}