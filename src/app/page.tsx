"use client";
import { useState } from 'react';

export default function PhoneRecommender() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    budget: 800,
    os: 'iOS',
    size: 'compact',
    refurbished: false
  });

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Errore nella ricerca');
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">NexPhone Recommender</h1>
          <p className="text-gray-600">Trova il tuo prossimo smartphone in pochi secondi.</p>
        </header>

        {/* Pannello Controlli */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (€)</label>
              <input type="number" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.budget} onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Operativo</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.os} onChange={(e) => setFormData({...formData, os: e.target.value})}>
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensione</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})}>
                <option value="compact">Compatto</option>
                <option value="large">Grande</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2 p-2.5">
                <input type="checkbox" className="w-5 h-5" checked={formData.refurbished} onChange={(e) => setFormData({...formData, refurbished: e.target.checked})} />
                <span className="text-sm font-medium text-gray-700">Includi rigenerati</span>
              </label>
            </div>
          </div>

          <button onClick={handleSearch} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md">
            {loading ? 'Analisi in corso...' : 'Cerca Telefoni'}
          </button>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6">{error}</div>}

        {/* Lista Risultati */}
        <div className="space-y-4">
          {results.map((phone: any) => (
            <div key={phone.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center transition hover:shadow-md">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{phone.name}</h3>
                <p className="text-blue-600 font-semibold">{phone.price} €</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>📸 {phone.camera}/10</span>
                  <span>🔋 {phone.battery}/10</span>
                </div>
              </div>
              {phone.offer && (
                <a href={phone.offer.url} target="_blank" className="bg-gray-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800">
                  Acquista
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
