"use client";
import { useState } from 'react';

export default function PhoneRecommender() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    budget: 800,
    os: 'iOS',
    size: 'compact',
    refurbished: false
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Errore nel recupero:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">NexPhone Recommender</h1>
      
      {/* Form di input */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg mb-8">
        <input 
          type="number" 
          placeholder="Budget (€)"
          className="p-2 border rounded"
          value={formData.budget}
          onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
        />
        <select 
          className="p-2 border rounded"
          value={formData.os}
          onChange={(e) => setFormData({...formData, os: e.target.value})}
        >
          <option value="iOS">iOS</option>
          <option value="Android">Android</option>
          <option value="any">Qualsiasi</option>
        </select>
        <button 
          onClick={handleSearch}
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold"
        >
          {loading ? 'Ricerca in corso...' : 'Trova il telefono perfetto'}
        </button>
      </div>

      {/* Griglia Risultati */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((phone: any) => (
          <div key={phone.id} className="border p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-bold">{phone.name}</h2>
            <p className="text-gray-600">Prezzo: {phone.price}€</p>
            <div className="mt-2 text-sm">
              <p>📸 Camera: {phone.camera}/10</p>
              <p>🔋 Batteria: {phone.battery}/10</p>
            </div>
            {phone.offer && (
              <a 
                href={phone.offer.url} 
                target="_blank" 
                className="mt-4 block text-center bg-green-600 text-white py-2 rounded"
              >
                Acquista ora
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
