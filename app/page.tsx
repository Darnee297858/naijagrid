'use client';

import { useState, useEffect } from 'react';

interface Artisan {
  id: number;
  name: string;
  skill: string;
  status: string;
  rating: string;
  location: string;
}

export default function Home() {
  const [powerStatus, setPowerStatus] = useState<string>('Loading...');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/power')
      .then((res) => res.json())
      .then((data) => setPowerStatus(data.message))
      .catch(() => setPowerStatus('Unable to load status'));

    fetch('/api/artisans')
      .then((res) => res.json())
      .then((data) => setArtisans(data))
      .catch(() => console.error('Failed to load artisans'));
  }, []);

  const reportPower = async (status: 'on' | 'off') => {
    setLoading(true);
    try {
      const res = await fetch('/api/power', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setPowerStatus(data.data.message);
        alert('Thank you for reporting! Zone updated successfully.');
      }
    } catch (error) {
      alert('Error reporting status. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-1">Live Power Status</h2>
        <p className="text-sm text-gray-600 mb-4">Report current light situation in your area</p>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => reportPower('on')}
            disabled={loading}
            className="flex-1 bg-naijaGreen hover:bg-naijaDarkGreen text-white font-semibold py-3 px-4 rounded-lg transition active:scale-95 disabled:opacity-50"
          >
            💡 Light Dey
          </button>
          <button
            onClick={() => reportPower('off')}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition active:scale-95 disabled:opacity-50"
          >
            🌑 Light Don Go
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg text-center font-bold text-lg border border-gray-100">
          {powerStatus}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-1">Verified Artisans Near You</h2>
        <p className="text-sm text-gray-600 mb-4">No scammers. Trusted professionals.</p>

        <div className="grid gap-4">
          {artisans.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Loading artisans...</p>
          ) : (
            artisans.map((artisan) => (
              <div key={artisan.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{artisan.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    artisan.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {artisan.status === 'Online' ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1"><strong>Skill:</strong> {artisan.skill}</p>
                <p className="text-sm text-gray-600"><strong>Location:</strong> {artisan.location}</p>
                <p className="text-sm text-gray-600 mt-1"><strong>Rating:</strong> {artisan.rating}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
