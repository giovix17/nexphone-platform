import {NextRequest,NextResponse} from 'next/server';import {supabase} from '@/lib/supabase';
export async function POST(request:NextRequest){const {phoneId,offerId,profileFingerprint}=await request.json();await supabase.from('affiliate_clicks').insert({phone_id:phoneId,offer_id:offerId,profile_fingerprint:profileFingerprint});return NextResponse.json({ok:true});}
