'use client';

import { useState, useMemo } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintPreview } from '@/components/print-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer } from 'lucide-react';

const MAX_EVENTS = 4;

const initialEvent: EventData = {
  title: 'Exemplo de Evento',
  date: new Date().toISOString().split('T')[0],
  startTime: '14:00',
  endTime: '18:00',
  description: 'Uma breve descrição do evento que será impresso no papel térmico.',
};

export default function Home() {
  const [storeName, setStoreName] = useState('LOJA X');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  const handlePrint = () => {
    window.print();
  };

  const handleAddEvent = () => {
    if (events.length < MAX_EVENTS) {
      const newEvent: EventData = {
        title: `Evento #${events.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '18:00',
        description: '',
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDataChange = (index: number, data: EventData) => {
    const originalIndex = events.findIndex(e => e.title === sortedEvents[index].title && e.date === sortedEvents[index].date && e.startTime === sortedEvents[index].startTime);
    if (originalIndex !== -1) {
      const newEvents = [...events];
      newEvents[originalIndex] = data;
      setEvents(newEvents);
    }
  };
  
  const handleRemoveEvent = (index: number) => {
    const originalIndex = events.findIndex(e => e.title === sortedEvents[index].title && e.date === sortedEvents[index].date && e.startTime === sortedEvents[index].startTime);
    if (originalIndex !== -1) {
      const newEvents = events.filter((_, i) => i !== originalIndex);
      setEvents(newEvents);
    }
  };


  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 no-print">
          <h1 className="text-4xl font-headline font-bold text-primary">Event Printer</h1>
          <p className="text-muted-foreground mt-2 font-body">Crie e imprima os seus eventos em formato de cupom fiscal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="no-print w-full">
            <CardHeader>
              <CardTitle className="font-headline">Detalhes do Evento</CardTitle>
              <CardDescription>Preencha os campos para gerar a pré-visualização em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input 
                  id="storeName" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                  placeholder="Ex: Shopping Iguatemi"
                />
              </div>

              {sortedEvents.map((eventData, index) => (
                <EventForm 
                  key={`${eventData.title}-${eventData.date}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)} 
                  initialData={eventData}
                  onRemove={() => handleRemoveEvent(index)}
                  showRemoveButton={events.length > 1}
                />
              ))}
               {events.length < MAX_EVENTS && (
                <Button onClick={handleAddEvent} className="w-full mt-4" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Evento
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center gap-6">
            <div id="print-container">
                {sortedEvents.map((eventData, index) => (
                    <div key={`${eventData.title}-${eventData.date}-${index}-preview`} className={index > 0 ? 'mt-4' : ''}>
                        <PrintPreview 
                          data={eventData}
                          storeName={storeName}
                          isLast={index === sortedEvents.length - 1}
                        />
                    </div>
                ))}
            </div>
            <Button onClick={handlePrint} className="w-full max-w-xs no-print" size="lg" variant="default">
              <Printer className="mr-2 h-5 w-5" />
              Imprimir Cupons
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
