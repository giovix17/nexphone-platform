# Nexphone platform

Base Next.js per il prodotto, distinta dal prototipo statico precedente.

## Avvio locale

1. Crea un progetto Supabase e applica `supabase/schema.sql` nel SQL Editor.
2. Copia `.env.example` in `.env.local` e inserisci le chiavi del progetto.
3. Installa le dipendenze con `npm install` e avvia `npm run dev`.

## Cosa contiene

- `src/lib/recommendation.ts`: black box per ranking spiegabile con hard/soft filters.
- `src/app/api/recommend`: API server-side con cache Vercel di cinque minuti.
- `src/app/api/click`: raccolta minima per deep-link e future affinità comportamentali.
- `supabase/schema.sql`: catalogo, offerte, prezzi, click, cluster e affinità.
- landing SEO long-tail e pagina modello con JSON-LD `Product` e `AggregateRating`.

## Prima del go-live

Inserire RLS in Supabase, provider prezzi/licenze immagini, link affiliati firmati, consenso analytics e job schedulato per lo storico prezzi e le affinità.
