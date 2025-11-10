"use client";

import type { EventData } from './event-form';
import { Card } from '@/components/ui/card';
import { PrintPreview } from './print-preview';

interface PrintContainerProps {
  events: EventData[];
  storeName: string;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

export function PrintContainer({ events, storeName }: PrintContainerProps) {
  const separator = "----------------------------------------";

  return (
    <Card
      className="receipt p-3 font-code shadow-lg transition-all relative overflow-hidden bg-gray-50 text-black"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      <div className="text-center">
        <h1 className="font-bold text-sm break-words">PRÓXIMOS EVENTOS RI HAPPY</h1>
        <h2 className="font-bold text-sm break-words uppercase">{storeName || 'NOME DA LOJA'}</h2>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>

      {events.map((eventData, index) => (
        <div key={`${eventData.title}-${eventData.date}-${index}-preview`}>
          <PrintPreview data={eventData} />
          {index < events.length -1 && (
             <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
          )}
        </div>
      ))}

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-center text-xs mt-2">
        <p>OBRIGADO E VOLTE SEMPRE!</p>
      </div>
      
      <div 
        className="torn-effect absolute bottom-0 left-0 right-0 h-3 bg-repeat-x"
        style={{
            backgroundImage: `radial-gradient(circle at 50% 0, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 100%, #f9fafb 0px, #f9fafb 1.5px, transparent 1.5px)`,
            backgroundSize: `6px 3px`,
            backgroundPosition: '0 -1.5px, 0 100%',
        }}
      />
    </Card>
  );
}
