"use client";

import type { EventData } from './event-form';
import { Card } from '@/components/ui/card';
import { PrintPreview } from './print-preview';
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
      className="receipt p-3 font-code shadow-lg transition-all relative overflow-hidden bg-gray-50 text-black text-center"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      <div className="text-center">
        <h1 className="font-bold text-sm break-words">PRÓXIMOS EVENTOS NA RI HAPPY</h1>
        <h2 className="font-bold text-sm break-words uppercase">{storeName || 'NOME DA LOJA'}</h2>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      {events.map((eventData, index) => (
        <div key={`${eventData.id}-preview-${index}`}>
          <PrintPreview data={eventData} />
          {index < events.length -1 && (
             <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
          )}
        </div>
      ))}

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-center text-xs mt-2 px-1">
        <p className="font-bold mt-2">Chame seus amigos e venha se divertir!</p>
        <p>Nossos eventos são gratuitos. Esperamos por você!</p>
      </div>

      <div className="flex justify-center my-2">
        <Image 
          src={qrCodeUrl}
          alt="QR Code para a página de eventos"
          width={80}
          height={80}
        />
      </div>
      <p className="text-xs mt-1 mb-2 text-center">Aponte a câmera e veja mais!</p>
      
      <div className="text-center text-xs mt-2 px-1">
        {(whatsapp || instagram) && (
          <>
            <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
            {whatsapp && <p>WhatsApp: {whatsapp}</p>}
            {instagram && <p>Instagram: {instagram}</p>}
          </>
        )}
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
