export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{
    intent?: string;
    budget?: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const intent = (resolved?.intent || '').replaceAll('-', ' ');
  const budget = resolved?.budget || '';
  
  return {
    title: `Migliori smartphone per ${intent} sotto ${budget}€ | Nexphone`,
    description: `Scopri gli smartphone più adatti per ${intent}, con un budget massimo di ${budget} euro.`,
  };
}

export default async function Landing({ params }: PageProps) {
  const resolved = await params;
  const intent = (resolved?.intent || '').replaceAll('-', ' ');
  const budget = resolved?.budget || '';

  return (
    <main style={{ maxWidth: 850, margin: '70px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <p style={{ color: '#0d6b4d', fontWeight: 700 }}>GUIDA PERSONALIZZATA</p>
      <h1>I migliori smartphone per {intent} sotto {budget}€</h1>
      <p>Una selezione aggiornata, con priorità, compromessi e offerte verificate. Imposta il tuo profilo per un ranking davvero personale.</p>
      <a href="/" style={{ color: '#0d6b4d', fontWeight: 700 }}>Trova il tuo match →</a>
    </main>
  );
}