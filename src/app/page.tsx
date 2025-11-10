'use client';

import { useState, useMemo } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintContainer } from '@/components/print-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const MAX_EVENTS = 4;

const initialEvent: EventData = {
  id: `evt_${Math.random()}`,
  title: 'Exemplo de Evento',
  subtitle: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '14:00',
  endTime: '18:00',
  description: 'Uma breve descrição do evento que será impresso no papel térmico.',
  predefinedEvent: 'outro',
};

export default function Home() {
  const [storeName, setStoreName] = useState('LOJA X');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);

  const showSameThemeSwitch = useMemo(() => {
    return events.some(event => event.predefinedEvent === 'happy_sabado');
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  const monthOfEvents = useMemo(() => {
    if (sortedEvents.length > 0) {
      try {
        const firstEventDate = new Date(sortedEvents[0].date + 'T00:00:00');
        return firstEventDate.toLocaleDateString('pt-BR', { month: 'long' });
      } catch {
        return '';
      }
    }
    return '';
  }, [sortedEvents]);
  
  const enhancedEvents = useMemo(() => {
    if (isSameThemeAllMonth && sortedEvents.length > 0) {
      const firstEvent = sortedEvents[0];
      const themeTitle = firstEvent.predefinedEvent === 'happy_sabado' 
        ? `Happy Sábado - ${firstEvent.subtitle}`
        : firstEvent.title;
      const themeDescription = `Todos os sábados do mês de ${monthOfEvents}.\n${firstEvent.description}`;

      return sortedEvents.map(event => ({
        ...event,
        title: themeTitle,
        subtitle: firstEvent.subtitle,
        description: themeDescription,
      }));
    }
    return sortedEvents.map(event => {
      if (event.predefinedEvent === 'happy_sabado') {
        return { ...event, title: `Happy Sábado - ${event.subtitle}` };
      }
      return event;
    });
  }, [sortedEvents, isSameThemeAllMonth, monthOfEvents]);


  const handlePrint = () => {
    window.print();
  };

  const handleAddEvent = () => {
    if (events.length < MAX_EVENTS) {
      const newEvent: EventData = {
        id: `evt_${Math.random()}`,
        title: ``,
        subtitle: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '18:00',
        description: '',
        predefinedEvent: 'outro',
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDataChange = (id: string, data: EventData) => {
    const newEvents = events.map(e => e.id === id ? data : e);
    setEvents(newEvents);
  };
  
  const handleRemoveEvent = (id: string) => {
    const newEvents = events.filter((e) => e.id !== id);
    setEvents(newEvents);
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
              
              {showSameThemeSwitch && (
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="same-theme-switch"
                    checked={isSameThemeAllMonth}
                    onCheckedChange={setIsSameThemeAllMonth}
                  />
                  <Label htmlFor="same-theme-switch">Usar o mesmo tema para todos os sábados do mês</Label>
                </div>
              )}

              {events.map((eventData, index) => (
                <EventForm 
                  key={eventData.id}
                  onDataChange={(data) => handleDataChange(eventData.id!, data)} 
                  initialData={eventData}
                  onRemove={() => handleRemoveEvent(eventData.id!)}
                  showRemoveButton={events.length > 1}
                  isSameThemeAllMonth={isSameThemeAllMonth}
                  isFirstEvent={index === 0}
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
              <PrintContainer
                storeName={storeName}
                events={enhancedEvents}
              />
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
