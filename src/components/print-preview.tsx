"use client";

import type { EventData } from './event-form';
import { Card } from '@/components/ui/card';

interface PrintPreviewProps {
  data: EventData;
}

// 80mm is a common thermal printer paper width.
// On screen, this can be represented by a fixed pixel width. ~300px is a good approximation.
const RECEIPT_WIDTH_PX = 302;
// 30mm height is very restrictive (~113px). We will allow content to grow for a better preview.
const RECEIPT_MIN_HEIGHT_PX = 113;

export function PrintPreview({ data }: PrintPreviewProps) {
  const { title, date, time, description } = data;

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'DD/MM/AAAA';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return 'Data inválida';
    }
  };

  const separator = "----------------------------------------";

  return (
    <Card
      className="receipt p-3 font-code shadow-lg transition-all relative overflow-hidden bg-gray-50 text-black"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      <div className="text-center">
        <h2 className="font-bold text-base break-words uppercase">{title || 'SEU EVENTO AQUI'}</h2>
      </div>
      
      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="flex justify-between text-xs px-1">
        <span>DATA: {formatDate(date)}</span>
        <span>HORA: {time || 'HH:MM'}</span>
      </div>
      
      {description && (
        <>
          <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
          <p className="text-xs break-words whitespace-pre-wrap px-1">{description}</p>
        </>
      )}

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
