import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';import {unstable_cache} from 'next/cache';import {supabase} from '@/lib/supabase';import {recommend} from '@/lib/recommendation';
const Input=z.object({budget:z.number().min(200).max(3000),os:z.enum(['Android','iOS','any']),size:z.enum(['compact','large','any']),refurbished:z.boolean(),priorities:z.record(z.string(),z.number().min(1).max(10))});
const getPhones=unstable_cache(async()=>{const {data,error}=await supabase.from('phone_catalog').select('*,offers(*)').eq('is_active',true);if(error)throw error;return data||[]},['phone-catalog-v1'],{revalidate:300,tags:['phone-catalog']});
export async function POST(request:NextRequest){const parsed=Input.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:'Profilo non valido'},{status:400});const phones=await getPhones();return NextResponse.json({results:recommend(parsed.data,phones),algorithmVersion:'v1.0.0'});}
