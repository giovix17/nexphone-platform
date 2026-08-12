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
      
      if (!response.ok) {
        throw new Error(data.error || 'Errore nella ricerca');
      }
      
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>NexPhone Recommender</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})} placeholder="Budget" />
        
        <select value={formData.os} onChange={(e) => setFormData({...formData, os: e.target.value})}>
          <option value="iOS">iOS</option>
          <option value="Android">Android</option>
        </select>

        <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})}>
          <option value="compact">Compatto</option>
          <option value="large">Grande</option>
        </select>

        <label>
          <input type="checkbox" checked={formData.refurbished} onChange={(e) => setFormData({...formData, refurbished: e.target.checked})} />
          Rigenerato
        </label>

        <button onClick={handleSearch} style={{ gridColumn: 'span 2', padding: '10px', cursor: 'pointer' }}>
          {loading ? 'Ricerca...' : 'Trova Telefono'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}

      <div style={{ marginTop: '20px' }}>
        {results.map((phone: any) => (
          <div key={phone.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <h3>{phone.name} - {phone.price}€</h3>
            <p>📸 Camera: {phone.camera} | 🔋 Batteria: {phone.battery}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
