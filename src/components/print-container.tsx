"use client";

import type { EventData } from './event-form';
import { Card } from '@/components/ui/card';
import { PrintPreview } from './print-preview';
import { Sun } from 'lucide-react';
import Image from 'next/image';

interface PrintContainerProps {
  events: EventData[];
  storeName: string;
  whatsapp?: string;
  instagram?: string;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

export function PrintContainer({ events, storeName, whatsapp, instagram }: PrintContainerProps) {
  const separator = "----------------------------------------";
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://www.rihappy.com.br/super-eventos";

  return (
    <Card
      className="receipt p-0 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      {/* Topo Institucional - Amarelo */}
      <div className="bg-yellow-400 text-black py-3 px-2 flex items-center justify-center gap-2 border-b-2 border-dashed border-black">
        <Sun className="fill-orange-500 text-orange-500 h-8 w-8" />
        <h1 className="font-bold text-sm leading-tight uppercase tracking-tight">
          PRÓXIMOS EVENTOS RI HAPPY
        </h1>
      </div>

      <div className="p-3">
        <div className="text-center mb-1">
          <h2 className="font-bold text-sm break-words uppercase">{storeName || 'NOME DA LOJA'}</h2>
        </div>

        <p className="text-xs my-1 text-center tracking-tighter opacity-30">{separator}</p>
        
        {events.map((eventData, index) => (
          <div key={`${eventData.id}-preview-${index}`}>
            <PrintPreview data={eventData} />
            {index < events.length -1 && (
               <p className="text-xs my-1 text-center tracking-tighter opacity-30">{separator}</p>
            )}
          </div>
        ))}

        <p className="text-xs my-1 text-center tracking-tighter opacity-30">{separator}</p>
        
        <div className="text-center text-xs mt-2 px-1">
          <p className="font-bold mt-2 uppercase">Chame seus amigos e venha se divertir!</p>
          <p className="text-[10px] opacity-70 mt-1">Nossos eventos são gratuitos. Esperamos por você!</p>
        </div>

        <div className="flex justify-center my-3">
          <Image 
            src={qrCodeUrl}
            alt="QR Code para a página de eventos"
            width={80}
            height={80}
            className="border p-1 bg-white"
          />
        </div>
        <p className="text-[10px] font-bold uppercase mb-2">Aponte a câmera e veja mais!</p>
        
        {(whatsapp || instagram) && (
          <div className="text-center text-[10px] mt-2 px-1 border-t border-dashed pt-2">
            {whatsapp && <p>WhatsApp: {whatsapp}</p>}
            {instagram && <p>Instagram: {instagram}</p>}
          </div>
        )}
      </div>
      
      <div 
        className="torn-effect absolute bottom-0 left-0 right-0 h-3 bg-repeat-x"
        style={{
            backgroundImage: `radial-gradient(circle at 50% 0, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 100%, #ffffff 0px, #ffffff 1.5px, transparent 1.5px)`,
            backgroundSize: `6px 3px`,
            backgroundPosition: '0 -1.5px, 0 100%',
        }}
      />
    </Card>
  );
}