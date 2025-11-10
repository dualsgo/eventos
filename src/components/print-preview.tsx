"use client";

import type { EventData } from './event-form';
import { Card } from '@/components/ui/card';

interface PrintPreviewProps {
  data: EventData;
  storeName: string;
  isLast: boolean;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

export function PrintPreview({ data, storeName, isLast }: PrintPreviewProps) {
  const { title, date, startTime, endTime, description } = data;

  const formatDateWithWeekday = (dateString: string) => {
    try {
      if (!dateString) return 'DD/MM/AAAA';
      const eventDate = new Date(dateString + 'T00:00:00'); // Assume timezone doesn't shift the day
      const weekday = eventDate.toLocaleDateString('pt-BR', { weekday: 'long' });
      const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${weekday.split('-')[0]}, ${formattedDate}`;
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
        <h1 className="font-bold text-sm break-words">PRÓXIMOS EVENTOS RI HAPPY</h1>
        <h2 className="font-bold text-sm break-words uppercase">{storeName || 'NOME DA LOJA'}</h2>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>

      <div className="text-center">
        <h3 className="font-bold text-base break-words uppercase">{title || 'SEU EVENTO AQUI'}</h3>
      </div>
      
      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-xs px-1 text-center">
        <p>{formatDateWithWeekday(date)}</p>
        <p>A PARTIR DE: {startTime || 'HH:MM'} E ATÉ {endTime || 'HH:MM'} HORAS</p>
      </div>
      
      {description && (
        <>
          <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
          <p className="text-xs break-words whitespace-pre-wrap px-1">{description}</p>
        </>
      )}

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      {isLast && (
        <div className="text-center text-xs mt-2">
          <p>OBRIGADO E VOLTE SEMPRE!</p>
        </div>
      )}
      
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
