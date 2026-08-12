export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const Input = z.object({
  budget: z.number().min(200).max(3000),
  os: z.enum(['Android', 'iOS', 'any']),
  size: z.enum(['compact', 'large', 'any']),
  refurbished: z.boolean(),
  priorities: z.record(z.string(), z.number().min(1).max(10)).optional()
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = Input.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Profilo non valido', details: parsed.error.format() }, { status: 400 });
    }

    const { budget, os } = parsed.data;

    const { data: rawPhones, error } = await supabase
      .from('phones')
      .select(`
        *,
        phone_scores (*),
        offers (
          *,
          merchants (*)
        )
      `)
      .eq('is_active', true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const processedPhones = (rawPhones || []).map(p => {
      const scoreObj = Array.isArray(p.phone_scores) ? (p.phone_scores[0] || {}) : (p.phone_scores || {});
      const firstOffer = Array.isArray(p.offers) ? (p.offers[0] || null) : (p.offers || null);
      const price = firstOffer?.price ?? p.price ?? 9999;

      return {
        ...p,
        price,
        camera: scoreObj.camera ?? p.camera ?? 5,
        battery: scoreObj.battery ?? p.battery ?? 5,
        performance: scoreObj.performance ?? p.performance ?? 5,
        display: scoreObj.display ?? p.display ?? 5,
        value: scoreObj.value ?? p.value ?? 5,
        software: scoreObj.software ?? p.software ?? 5,
        build: scoreObj.build ?? p.build ?? 5,
        phone_scores: scoreObj,
        scores: scoreObj,
        offers: p.offers || [],
        offer: firstOffer
      };
    });

    const filtered = processedPhones.filter(p => {
      if (p.price && p.price > budget * 1.3) return false;
      if (os && os !== 'any' && p.os && p.os.toLowerCase() !== os.toLowerCase()) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const scoreA = (a.camera + a.battery + a.performance + a.display) / 4;
      const scoreB = (b.camera + b.battery + b.performance + b.display) / 4;
      return scoreB - scoreA;
    });

    const results = filtered.length > 0 ? filtered : processedPhones;

    return NextResponse.json({ 
      results, 
      algorithmVersion: 'v2.0.0-standalone' 
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
