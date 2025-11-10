'use client';

import { useState } from 'react';
import type { EventData } from '@/components/event-form';
import { EventForm } from '@/components/event-form';
import { PrintPreview } from '@/components/print-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer } from 'lucide-react';

export default function Home() {
  const [eventData, setEventData] = useState<EventData>({
    title: 'Exemplo de Evento',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    description: 'Uma breve descrição do evento que será impresso no papel térmico.',
  });

  const handlePrint = () => {
    window.print();
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
            <CardContent>
              <EventForm onDataChange={setEventData} initialData={eventData} />
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center gap-6">
            <div id="print-container">
              <PrintPreview data={eventData} />
            </div>
            <Button onClick={handlePrint} className="w-full max-w-xs no-print" size="lg" variant="default">
              <Printer className="mr-2 h-5 w-5" />
              Imprimir Cupom
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
