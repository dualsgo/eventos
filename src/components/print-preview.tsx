"use client";

import type { EventData } from './event-form';

interface PrintPreviewProps {
  data: EventData;
}

export function PrintPreview({ data }: PrintPreviewProps) {
  const { title, date, startTime, endTime, description } = data;

  const formatDateWithWeekday = (dateString: string) => {
    try {
      if (!dateString) return null;
      const eventDate = new Date(dateString + 'T00:00:00'); // Assume timezone doesn't shift the day
      const weekday = eventDate.toLocaleDateString('pt-BR', { weekday: 'long' });
      const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      // Capitalize weekday
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      return `${capitalizedWeekday.split('-')[0]}, ${formattedDate}`;
    } catch {
      return 'Data inválida';
    }
  };

  const formatTimeRange = () => {
    let timeText = '';
    if (startTime) {
      timeText += `A PARTIR DE: ${startTime}`;
    }
    if (endTime) {
      timeText += ` ATÉ ${endTime} HORAS`;
    } else if (startTime) {
      timeText += ' HORAS';
    }
    return timeText || null;
  }

  const separator = "----------------------------------------";
  const formattedDate = formatDateWithWeekday(date);
  const formattedTime = formatTimeRange();

  // If the event is the unified one, don't show date/time, just description.
  if (data.id === 'unified_happy_sabado') {
     return (
        <div className="text-center">
            <h3 className="font-bold text-base break-words uppercase">{title || 'SEU EVENTO AQUI'}</h3>
             <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
            <p className="text-xs break-words whitespace-pre-wrap px-1">{description}</p>
        </div>
     )
  }

  return (
    <div className="text-center">
      <h3 className="font-bold text-base break-words uppercase">{title || 'SEU EVENTO AQUI'}</h3>
      
      {(formattedDate || formattedTime) && <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>}
      
      {(formattedDate || formattedTime) && (
        <div className="text-xs px-1 text-center">
          {formattedDate && <p>{formattedDate}</p>}
          {formattedTime && <p>{formattedTime}</p>}
        </div>
      )}
      
      {description && (
        <>
          <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
          <p className="text-xs break-words whitespace-pre-wrap px-1">{description}</p>
        </>
      )}
    </div>
  );
}
