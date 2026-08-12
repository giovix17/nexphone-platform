"use client";
import { useState } from 'react';

export default function PhoneRecommender() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    budget: 1200,
    os: 'iOS',
    size: 'any',
    refurbished: false,
    priorities: {
      camera: 8,
      battery: 7,
      performance: 9,
      display: 8
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            NexPhone Studio
          </h1>
          <p className="text-slate-400 mt-2">Configuratore avanzato e intelligente per la scelta dello smartphone ideale.</p>
        </div>

        {/* Main Control Panel */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Budget */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Massimo (€)</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" min="300" max="2500" step="50"
                  className="w-full accent-indigo-500 bg-slate-800"
                  value={formData.budget} 
                  onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})} 
                />
                <span className="text-xl font-bold text-indigo-400 whitespace-nowrap">{formData.budget}€</span>
              </div>
            </div>

            {/* OS Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sistema Operativo</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['iOS', 'Android', 'any'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFormData({...formData, os: item})}
                    className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${formData.os === item ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    {item === 'any' ? 'Tutti' : item}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Formato / Dimensioni</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['compact', 'large', 'any'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFormData({...formData, size: item})}
                    className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${formData.size === item ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    {item === 'compact' ? 'Compatto' : item === 'large' ? 'Grande' : 'Tutti'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Priorities Sliders */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Priorità e Pesi Tecnici (1-10)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.priorities).map(([key, value]) => (
                <div key={key} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm capitalize">
                    <span className="font-medium text-slate-300">
                      {key === 'camera' ? '📸 Fotocamera' : key === 'battery' ? '🔋 Batteria' : key === 'performance' ? '⚡ Prestazioni' : '🖥️ Display'}
                    </span>
                    <span className="text-indigo-400 font-bold">{value}</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    className="w-full accent-indigo-500 bg-slate-800"
                    value={value} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      priorities: { ...formData.priorities, [key]: Number(e.target.value) }
                    })} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Refurbished Toggle & Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-indigo-500 rounded bg-slate-950 border-slate-800"
                checked={formData.refurbished} 
                onChange={(e) => setFormData({...formData, refurbished: e.target.checked})} 
              />
              <span className="text-sm font-medium text-slate-300">Considera anche dispositivi rigenerati / ricondizionati</span>
            </label>

            <button 
              onClick={handleSearch} 
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Elaborazione IA...' : 'Genera Raccomandazioni'}
            </button>
          </div>
        </div>

        {error && <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 rounded-xl">{error}</div>}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((phone: any) => (
            <div key={phone.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition shadow-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                      {phone.os || 'Smartphone'}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-2">{phone.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">{phone.price} €</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-sm">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Camera</span>
                    <span className="font-bold text-slate-200">{phone.camera}/10</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Batteria</span>
                    <span className="font-bold text-slate-200">{phone.battery}/10</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Performance</span>
                    <span className="font-bold text-slate-200">{phone.performance}/10</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Display</span>
                    <span className="font-bold text-slate-200">{phone.display}/10</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">{phone.offer ? `Offerta disponibile` : 'Prezzo di listino'}</span>
                {phone.offer?.url ? (
                  <a href={phone.offer.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 text-sm">
                    Acquista al prezzo migliore
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Disponibile nei negozi</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
