'use client';

import { useState, useEffect } from 'react';

type Result = {
  id: string;
  name: string;
  brand: string;
  price: number;
  match: number;
  why: string[];
  offer: {
    merchant: string;
    warrantyMonths: number;
    official: boolean;
    updatedAt: string;
    url: string;
  };
};

const initial = {
  budget: 800,
  os: 'any',
  size: 'any',
  refurbished: true,
  priorities: {
    camera: 7,
    battery: 7,
    performance: 5,
    video: 5,
    software: 7,
    display: 5,
    build: 5,
    value: 6,
  },
};

export default function Home() {
  const [answers, setAnswers] = useState(initial);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  // Funzione di ricerca automatica collegata al backend
  const find = async (currentAnswers = answers) => {
    setLoading(true);
    try {
      const r = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAnswers),
      });
      const data = await r.json();
      setResults(data.results || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Esegue la ricerca automaticamente al caricamento e ogni volta che cambiano le risposte
  useEffect(() => {
    find(answers);
  }, [answers.budget, answers.os, answers.refurbished]);

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <b>nex<span>phone</span></b>
        {loading && <span style={{ fontSize: 14, color: '#666' }}>Aggiornamento in corso...</span>}
      </nav>

      <section style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: '#666', fontWeight: 600 }}>CONSIGLI COSTRUITI INTORNO A TE</p>
        <h1 style={{ fontSize: 32, margin: '8px 0' }}>Lo smartphone giusto. <span style={{ color: '#0d6b4d' }}>Per te.</span></h1>
        <span>Modifica una preferenza e il ranking si aggiorna in tempo reale.</span>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <aside style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, border: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Il tuo profilo</h2>
          
          <label style={{ display: 'block', margin: '16px 0', fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Budget</span>
              <strong style={{ color: '#0d6b4d' }}>€{answers.budget}</strong>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={answers.budget}
              onChange={e => setAnswers({ ...answers, budget: +e.target.value })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[
              { id: 'any', label: 'Qualsiasi OS' },
              { id: 'android', label: 'Android' },
              { id: 'ios', label: 'iOS' }
            ].map(x => (
              <button
                key={x.id}
                onClick={() => setAnswers({ ...answers, os: x.id })}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: answers.os === x.id ? '#000' : '#e5e5e5',
                  color: answers.os === x.id ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {x.label}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={answers.refurbished}
              onChange={e => setAnswers({ ...answers, refurbished: e.target.checked })}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            Accetto Ricondizionato Garantito
          </label>
        </aside>

        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Risultati ({results.length})</h2>
          {results.length === 0 && !loading && (
            <p style={{ color: '#666' }}>Nessuno smartphone trovato con questi filtri. Prova ad alzare il budget o cambiare i filtri.</p>
          )}
          {results.map(phone => (
            <div key={phone.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 16, background: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{phone.name} ({phone.brand})</h3>
              <p style={{ margin: '4px 0' }}>Match Score: <strong style={{ color: '#0d6b4d' }}>{phone.match}%</strong></p>
              <p style={{ margin: '4px 0' }}>Prezzo: <strong>€{phone.price}</strong> ({phone.offer?.merchant})</p>
              {phone.offer?.url && (
                <a href={phone.offer.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0d6b4d', fontWeight: 600, display: 'inline-block', marginTop: 8 }}>
                  Vedi offerta →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}