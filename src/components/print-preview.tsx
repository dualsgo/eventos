"use client";

import type { EventData } from './event-form';

interface PrintPreviewProps {
  data: EventData;
}

export function PrintPreview({ data }: PrintPreviewProps) {
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
    <>
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
    </>
  );
}
