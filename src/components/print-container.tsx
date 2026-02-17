"use client";

import type { EventData } from './event-form';
import { Card } from '@/components/ui/card';
import { PrintPreview } from './print-preview';

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

  return (
    <Card
      className="receipt p-4 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      {/* Header Estilo Nota Fiscal */}
      <div className="text-center mb-2">
        <h1 className="font-bold text-base uppercase leading-tight tracking-tight">PRÓXIMOS EVENTOS</h1>
        <h2 className="font-bold text-sm break-words uppercase mt-1">RI HAPPY - {storeName || 'UNIDADE'}</h2>
      </div>

      <p className="text-xs my-2 text-center tracking-tighter opacity-30">{separator}</p>
      
      <div className="space-y-4">
        {events.map((eventData, index) => (
          <div key={`${eventData.id}-preview-${index}`}>
            <PrintPreview data={eventData} />
            {index < events.length - 1 && (
               <p className="text-xs my-3 text-center tracking-tighter opacity-10 border-b border-dashed border-black" />
            )}
          </div>
        ))}
      </div>

      <p className="text-xs my-2 text-center tracking-tighter opacity-30">{separator}</p>
      
      <div className="text-center text-xs mt-2 px-1">
        <p className="font-bold text-sm uppercase leading-tight">Chame seus amigos e venha se divertir!</p>
        <p className="text-[10px] font-medium mt-1">Nossos eventos são gratuitos. Esperamos por você!</p>
      </div>

      {(whatsapp || instagram) && (
        <>
          <p className="text-xs my-2 text-center tracking-tighter opacity-30">{separator}</p>
          <div className="text-center text-[10px] font-bold space-y-1">
            {whatsapp && <p>WHATSAPP: {whatsapp}</p>}
            {instagram && <p>INSTAGRAM: {instagram}</p>}
          </div>
        </>
      )}

      <div className="mt-4 pt-2 border-t border-dotted border-black">
         <p className="text-[8px] uppercase font-bold opacity-60">Informativo Interno - Ri Happy Brinquedos</p>
      </div>
      
      {/* Efeito visual de papel rasgado (apenas tela) */}
      <div 
        className="torn-effect absolute bottom-0 left-0 right-0 h-3 bg-repeat-x no-print"
        style={{
            backgroundImage: `radial-gradient(circle at 50% 0, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 100%, #ffffff 0px, #ffffff 1.5px, transparent 1.5px)`,
            backgroundSize: `6px 3px`,
            backgroundPosition: '0 -1.5px, 0 100%',
        }}
      />
    </Card>
  );
}
