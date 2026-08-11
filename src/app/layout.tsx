import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://nexphone.it'),title:'Nexphone — lo smartphone giusto per te',description:'Trova lo smartphone più adatto alle tue esigenze con consigli spiegati.',alternates:{canonical:'/'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="it"><body>{children}</body></html>}
