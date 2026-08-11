import type {Answers,Phone,RankedPhone} from './types';
const labels:Record<string,string>={camera:'fotocamera',battery:'autonomia',performance:'prestazioni',video:'video',software:'longevità software',display:'display',build:'qualità costruttiva',value:'rapporto qualità-prezzo'};
export function recommend(answers:Answers, phones:Phone[]):RankedPhone[]{
  const hard=(p:Phone)=>{const reasons:string[]=[];if(p.price>answers.budget)reasons.push('supera il budget massimo');if(answers.os!=='any'&&p.os!==answers.os)reasons.push(`usa ${p.os}, non il sistema operativo richiesto`);if(!answers.refurbished&&p.refurbished)reasons.push('è disponibile solo come ricondizionato');return reasons};
  const weights={...answers.priorities,value:Math.max(1,Math.round(answers.priorities.value||4))};
  return phones.map(phone=>{const discardedBecause=hard(phone);const weightTotal=Object.values(weights).reduce((a,b)=>a+b,0);let raw=Object.entries(weights).reduce((sum,[key,w])=>sum+(phone.scores[key]||50)*w,0)/weightTotal;
    if(answers.size!=='any')raw+=phone.size===answers.size?6:-7; // soft preference
    const strongest=Object.entries(weights).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>labels[k]);
    const why=[`Allineato alle tue priorità: ${strongest.join(' e ')}.`,phone.size===answers.size?'Il formato rispetta la tua preferenza.':'È un compromesso di dimensioni accettabile per il punteggio complessivo.'];
    return {...phone,match:discardedBecause.length?0:Math.min(99,Math.round(raw)),why,discardedBecause};
  }).filter(p=>!p.discardedBecause.length).sort((a,b)=>b.match-a.match);
}
