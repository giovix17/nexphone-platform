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
    performance: 7,
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

  useEffect(() => {
    find(answers);
  }, [answers]);

  const updatePriority = (key: string, val: number) => {
    setAnswers({
      ...answers,
      priorities: {
        ...answers.priorities,
        [key]: val,
      },
    });
  };

  return (
    <main style={{ maxWidth: 1000, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <b style={{ fontSize: 20 }}>nex<span>phone</span></b>
        {loading && <span style={{ fontSize: 14, color: '#666' }}>Aggiornamento in corso...</span>}
      </nav>

      <section style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: '#0d6b4d', fontWeight: 700, letterSpacing: 1 }}>CONSIGLI COSTRUITI INTORNO A TE</p>
        <h1 style={{ fontSize: 32, margin: '8px 0' }}>Lo smartphone giusto. <span style={{ color: '#0d6b4d' }}>Per te.</span></h1>
        <p style={{ color: '#555' }}>Modifica una preferenza o una priorità e il ranking si aggiorna in tempo reale.</p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>
        {/* Pannello filtri e priorità */}
        <aside style={{ background: '#f9f9f9', padding: 24, borderRadius: 12, border: '1px solid #eaeaea', height: 'fit-content' }}>
          <h2 style={{ fontSize: 18, marginBottom: 20 }}>Il tuo profilo</h2>
          
          {/* Budget */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>Budget massimo</span>
              <strong style={{ color: '#0d6b4d' }}>€{answers.budget}</strong>
            </div>
            <input
              type="range"
              min="200"
              max="1600"
              step="50"
              value={answers.budget}
              onChange={e => setAnswers({ ...answers, budget: +e.target.value })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* OS */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Sistema Operativo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'any', label: 'Qualsiasi' },
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
          </div>

          {/* Ricondizionato */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={answers.refurbished}
                onChange={e => setAnswers({ ...answers, refurbished: e.target.checked })}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              Accetto Ricondizionato Garantito
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />

          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Cosa conti di più per te?</h3>
          
          {/* Priorità Slider */}
          {[
            { key: 'camera', label: 'Fotocamera principale' },
            { key: 'battery', label: 'Autonomia / Batteria' },
            { key: 'performance', label: 'Prestazioni & Gaming' },
            { key: 'display', label: 'Display & Luminosità' },
            { key: 'software', label: 'Longevità & Software' },
          ].map(p => (
            <div key={p.key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>{p.label}</span>
                <span style={{ color: '#666' }}>{answers.priorities[p.key as keyof typeof answers.priorities]}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={answers.priorities[p.key as keyof typeof answers.priorities]}
                onChange={e => updatePriority(p.key, +e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          ))}
        </aside>

        {/* Risultati */}
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Risultati ({results.length})</h2>
          
          {results.length === 0 && !loading && (
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 24, borderRadius: 8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Nessuno smartphone trovato.</p>
              <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
                Se vedi sempre 0 risultati, verifica di aver popolato le tabelle del database su Supabase con almeno qualche modello di smartphone e offerta associata.
              </p>
            </div>
          )}

          {results.map(phone => (
            <div key={phone.id} style={{ border: '1px solid #e5e5e5', padding: 20, borderRadius: 8, marginBottom: 16, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 12, background: '#eef5f2', color: '#0d6b4d', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{phone.brand}</span>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: 18 }}>{phone.name}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#0d6b4d' }}>€{phone.price}</span>
                  <div style={{ fontSize: 12, color: '#666' }}>Match: {phone.match}%</div>
                </div>
              </div>

              {phone.why && phone.why.length > 0 && (
                <ul style={{ margin: '12px 0', paddingLeft: 20, fontSize: 14, color: '#444' }}>
                  {phone.why.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              )}

              {phone.offer?.url && (
                <a href={phone.offer.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12, background: '#0d6b4d', color: '#fff', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                  Vedi offerta su {phone.offer.merchant} →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}