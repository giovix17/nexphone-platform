'use client';

import { useState } from 'react';

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

  const find = async () => {
    setLoading(true);
    const r = await fetch('/api/recommend', {
      method: 'POST',
      body: JSON.stringify(answers),
    });
    const data = await r.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <b>nex<span>phone</span></b>
        <button onClick={find} disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {loading ? 'Aggiornamento...' : 'Aggiorna i match'}
        </button>
      </nav>

      <section style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: '#666' }}>CONSIGLI COSTRUITI INTORNO A TE</p>
        <h1 style={{ fontSize: 32, margin: '8px 0' }}>Lo smartphone giusto. <em>Per te.</em></h1>
        <span>Modifica una preferenza e il ranking si aggiorna senza ricominciare.</span>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <aside style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
          <h2>Il tuo profilo</h2>
          <label style={{ display: 'block', margin: '16px 0' }}>
            Budget <strong>€{answers.budget}</strong>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={answers.budget}
              onChange={e => setAnswers({ ...answers, budget: +e.target.value })}
              style={{ width: '100%', display: 'block', marginTop: 8 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {(['any', 'Android', 'iOS'] as const).map(x => (
              <button
                key={x}
                onClick={() => setAnswers({ ...answers, os: x })}
                style={{
                  padding: '6px 12px',
                  background: answers.os === x ? '#000' : '#ddd',
                  color: answers.os === x ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                {x === 'any' ? 'Qualsiasi OS' : x}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={answers.refurbished}
              onChange={e => setAnswers({ ...answers, refurbished: e.target.checked })}
            />
            Accetto ricondizionato garantito
          </label>
        </aside>

        <div>
          <h2>Risultati ({results.length})</h2>
          {results.map(phone => (
            <div key={phone.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <h3>{phone.name} ({phone.brand})</h3>
              <p>Match Score: <strong>{phone.match}%</strong></p>
              <p>Prezzo: <strong>€{phone.price}</strong> ({phone.offer.merchant})</p>
              <a href={phone.offer.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                Vedi offerta
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}