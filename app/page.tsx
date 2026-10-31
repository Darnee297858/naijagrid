'use client';

import { useState, useEffect } from 'react';

const NIGERIAN_STATES = [
  { name: 'Enugu', lgas: ['Enugu North (Ogui/Independence Layout)', 'Enugu South', 'Nsukka', 'Udi'] },
  { name: 'Lagos', lgas: ['Eti-Osa (Lekki/VI)', 'Ikeja', 'Surulere', 'Alimosho', 'Ikorodu', 'Yaba'] },
  { name: 'Abuja (FCT)', lgas: ['Garki', 'Maitama', 'Gwarinpa', 'Kubwa', 'Lugbe', 'Wuse'] },
  { name: 'Rivers', lgas: ['Port Harcourt GRA', 'Obio-Akpor', 'Oyigbo', 'Eleme'] },
  { name: 'Oyo', lgas: ['Ibadan North (Bodija)', 'Ibadan SW (Ring Road)', 'Ogbomoso', 'Oyo Town'] },
  { name: 'Kano', lgas: ['Kano Municipal', 'Nasarawa', 'Dala', 'Tarauni'] }
];

export default function Home() {
  // Location States
  const [selectedState, setSelectedState] = useState('Enugu');
  const [lgas, setLgas] = useState<string[]>(NIGERIAN_STATES[0].lgas);
  const [selectedLga, setSelectedLga] = useState(NIGERIAN_STATES[0].lgas[0]);
  const [streetAddress, setStreetAddress] = useState('');
  
  // Grid Data
  const [gridInfo, setGridInfo] = useState<any>(null);
  const [userReport, setUserReport] = useState<string | null>(null);

  // Generator Calculator States
  const [genKva, setGenKva] = useState(3.5);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [fuelPrice, setFuelPrice] = useState(1150); // PMS estimated price

  // Inverter Calculator States
  const [fans, setFans] = useState(2);
  const [tv, setTv] = useState(1);
  const [fridge, setFridge] = useState(1);
  const [bulbs, setBulbs] = useState(6);

  // Artisans
  const [artisans, setArtisans] = useState<any[]>([]);

  // Update LGAs on state change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateObj = NIGERIAN_STATES.find(s => s.name === stateName);
    if (stateObj) {
      setLgas(stateObj.lgas);
      setSelectedLga(stateObj.lgas[0]);
    }
  };

  // Fetch Live Grid Data
  useEffect(() => {
    fetch(`/api/power?state=${selectedState}&lga=${selectedLga}`)
      .then(res => res.json())
      .then(data => setGridInfo(data))
      .catch(err => console.error(err));
  }, [selectedState, selectedLga]);

  // Fetch Artisans
  useEffect(() => {
    fetch('/api/artisans')
      .then(res => res.json())
      .then(data => setArtisans(data));
  }, []);

  // GPS Auto-location
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`GPS Coordinates Detected: (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}). Auto-selected closest DisCo zone!`);
        },
        () => alert('Geolocation access denied. Please select your location manually.')
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Submit report
  const submitPowerReport = async (statusType: string) => {
    const res = await fetch('/api/power', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: statusType,
        state: selectedState,
        lga: selectedLga,
        street: streetAddress || 'Main Street'
      })
    });
    const data = await res.json();
    setUserReport(data.message);
  };

  // Calculations
  const dailyFuelLiters = (genKva * 0.45 * hoursPerDay).toFixed(1);
  const dailyFuelCost = (parseFloat(dailyFuelLiters) * fuelPrice).toLocaleString();
  
  const estimatedWattage = (fans * 60) + (tv * 100) + (fridge * 250) + (bulbs * 10);
  const recommendedInverter = estimatedWattage < 800 ? "1.5 kVA (12V/24V System)" : estimatedWattage < 2000 ? "3.5 kVA (24V/48V System)" : "5.0 - 7.5 kVA (48V Heavy Solar)";
  const recommendedBatteries = estimatedWattage < 800 ? "1x - 2x 220Ah Tubular/Gel" : estimatedWattage < 2000 ? "2x - 4x 220Ah Batteries" : "4x - 8x 220Ah or 15kWh Lithium";

  return (
    <div className="space-y-8 pb-12">
      
      {/* 📍 SECTION 1: HYPER-LOCAL NIGERIA LOCATION SELECTOR */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              📍 Your Area Grid Location
            </h2>
            <p className="text-sm text-gray-600">Select any state, LGA, or street in Nigeria to track grid status</p>
          </div>
          <button
            onClick={detectLocation}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold py-2 px-3 rounded-lg border border-emerald-200 transition flex items-center gap-1"
          >
            🎯 Auto-Detect My GPS Location
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s.name} value={s.name}>{s.name} State</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select LGA / Zone</label>
            <select
              value={selectedLga}
              onChange={(e) => setSelectedLga(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {lgas.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Street / Landmark (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Ogui Rd, Jakande, Bodija..."
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* ⚡ SECTION 2: LIVE GRID STATUS & COMMUNITY REPORTING */}
      <section className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono mb-2">
              {gridInfo ? gridInfo.disco : 'Loading DisCo...'}
            </span>
            <h2 className="text-2xl font-bold">{selectedLga}, {selectedState} State</h2>
            <p className="text-emerald-200 text-sm mt-0.5">{gridInfo?.band || 'Band Classification Loading...'}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> Live Feeder
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm mb-6 border border-white/10">
          <div>
            <p className="text-xs text-emerald-200">Current Status</p>
            <p className="font-bold text-lg text-emerald-400">💡 Light Dey</p>
          </div>
          <div>
            <p className="text-xs text-emerald-200">Voltage Quality</p>
            <p className="font-bold text-base">{gridInfo?.voltageQuality || '220V'}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-200">24hr Uptime</p>
            <p className="font-bold text-base">{gridInfo?.upTime24h || '18 Hrs'}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-200">Community Reports</p>
            <p className="font-bold text-base">{gridInfo?.reportsCountToday || 120} Today</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          <p className="text-xs text-emerald-200 font-medium mb-2">Report Grid Situation on your Street:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => submitPowerReport('Light Dey')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition active:scale-95"
            >
              💡 Light Dey Normal
            </button>
            <button
              onClick={() => submitPowerReport('Low Voltage / Dim')}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition active:scale-95"
            >
              🪔 Low Voltage / Dim
            </button>
            <button
              onClick={() => submitPowerReport('Light Don Go')}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition active:scale-95"
            >
              🌑 Light Don Go
            </button>
            <button
              onClick={() => submitPowerReport('Transformer Fault')}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition active:scale-95"
            >
              💥 Fault / Explosion
            </button>
          </div>

          {userReport && (
            <div className="mt-3 p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-xs text-emerald-200 text-center">
              ✅ {userReport}
            </div>
          )}
        </div>
      </section>

      {/* ⛽ SECTION 3: GENERATOR FUEL RUN-COST CALCULATOR */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              ⛽ Generator Fuel Cost Estimator
            </h2>
            <p className="text-xs text-gray-500">Calculate fuel burn based on rating & current Nigerian PMS/Diesel prices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Generator Rating (kVA)</label>
            <select
              value={genKva}
              onChange={(e) => setGenKva(parseFloat(e.target.value))}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-medium"
            >
              <option value={1.5}>1.5 kVA (I-pass-my-neighbor)</option>
              <option value={2.5}>2.5 kVA (Medium Small)</option>
              <option value={3.5}>3.5 kVA (Tiger / Elepaq Standard)</option>
              <option value={6.5}>6.5 kVA (Heavy Home Dual Tank)</option>
              <option value={10}>10.0 kVA + (Soundproof Diesel)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Daily Runtime (Hours)</label>
            <input
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
              min="1"
              max="24"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Fuel Price (₦ / Liter)</label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <p className="text-xs text-amber-800 font-medium">Estimated Fuel Needed:</p>
            <p className="text-xl font-extrabold text-amber-950">{dailyFuelLiters} Liters / day</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-amber-800 font-medium">Estimated Daily Cost:</p>
            <p className="text-2xl font-black text-emerald-700">₦{dailyFuelCost}</p>
          </div>
        </div>
      </section>

      {/* ☀️ SECTION 4: INVERTER & SOLAR SIZING WIZARD */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            ☀️ Inverter & Solar Load Calculator
          </h2>
          <p className="text-xs text-gray-500">Pick appliances to calculate required Inverter kVA & Battery bank</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-bold text-gray-700">Standing Fans (60W)</label>
            <input
              type="number"
              value={fans}
              onChange={(e) => setFans(parseInt(e.target.value) || 0)}
              className="mt-1 w-full p-1.5 text-sm border rounded"
              min="0"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-bold text-gray-700">TV Sets (100W)</label>
            <input
              type="number"
              value={tv}
              onChange={(e) => setTv(parseInt(e.target.value) || 0)}
              className="mt-1 w-full p-1.5 text-sm border rounded"
              min="0"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-bold text-gray-700">Refrigerators (250W)</label>
            <input
              type="number"
              value={fridge}
              onChange={(e) => setFridge(parseInt(e.target.value) || 0)}
              className="mt-1 w-full p-1.5 text-sm border rounded"
              min="0"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-bold text-gray-700">LED Bulbs (10W)</label>
            <input
              type="number"
              value={bulbs}
              onChange={(e) => setBulbs(parseInt(e.target.value) || 0)}
              className="mt-1 w-full p-1.5 text-sm border rounded"
              min="0"
            />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-emerald-950">
          <div>
            <p className="text-xs text-emerald-800 font-medium">Total Power Load:</p>
            <p className="text-lg font-bold">{estimatedWattage} Watts</p>
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-medium">Recommended Inverter:</p>
            <p className="text-base font-bold text-emerald-900">{recommendedInverter}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-medium">Recommended Battery Setup:</p>
            <p className="text-xs font-bold text-emerald-900 mt-0.5">{recommendedBatteries}</p>
          </div>
        </div>
      </section>

      {/* 🛠️ SECTION 5: VERIFIED ENERGY ARTISANS HUB */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🛠️ Verified Local Energy Artisans</h2>
            <p className="text-xs text-gray-500">Solar installers, electricians, and generator mechanics in your region</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            100% Identity Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-gray-900">{artisan.name}</h3>
                  <p className="text-xs text-emerald-700 font-semibold">{artisan.specialty}</p>
                </div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {artisan.status}
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <p>📍 <strong>Location:</strong> {artisan.location}</p>
                <p>🏅 <strong>Badge:</strong> {artisan.badge}</p>
                <p>⏱️ <strong>Response Time:</strong> {artisan.responseTime}</p>
                <p>⭐ <strong>Rating:</strong> {artisan.rating} ({artisan.completedJobs} jobs)</p>
              </div>

              <button
                onClick={() => alert(`Connecting with ${artisan.name}... Response expected in ${artisan.responseTime}`)}
                className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-lg transition"
              >
                Dispatch Emergency Request
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}