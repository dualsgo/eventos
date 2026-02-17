"use client";

import { useState, useMemo, useEffect } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintContainer } from '@/components/print-container';
import { DiscountCoupon } from '@/components/discount-coupon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer, CalendarDays, TicketPercent, Store as StoreIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const MAX_EVENTS = 4;
const LOCAL_STORAGE_KEY_STORE = "eventPrinter.storeName";
const LOCAL_STORAGE_KEY_WHATSAPP = "eventPrinter.whatsapp";
const LOCAL_STORAGE_KEY_INSTAGRAM = "eventPrinter.instagram";
const LOCAL_STORAGE_KEY_EVENTS = "eventPrinter.events";

type ViewMode = 'events' | 'discount';

const initialEvent: EventData = {
  id: `evt_${Math.random()}`,
  title: 'Exemplo de Evento',
  subtitle: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '14:00',
  endTime: '18:00',
  description: 'Uma breve descrição do evento que será impresso no papel térmico.',
  predefinedEvent: 'outro',
  isActive: true,
};

export default function Home() {
  const [storeName, setStoreName] = useState('LOJA X');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("events");

  useEffect(() => {
    try {
      const savedStoreName = localStorage.getItem(LOCAL_STORAGE_KEY_STORE);
      if (savedStoreName) setStoreName(JSON.parse(savedStoreName));
      const savedWhatsapp = localStorage.getItem(LOCAL_STORAGE_KEY_WHATSAPP);
      if (savedWhatsapp) setWhatsapp(JSON.parse(savedWhatsapp));
      const savedInstagram = localStorage.getItem(LOCAL_STORAGE_KEY_INSTAGRAM);
      if (savedInstagram) {
        setInstagram(JSON.parse(savedInstagram));
      }
      
      const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        if (parsedEvents && parsedEvents.length > 0) {
          const eventsWithActiveState = parsedEvents.map((e: any) => ({
            ...e,
            isActive: e.isActive !== undefined ? e.isActive : true,
          }));
          setEvents(eventsWithActiveState);
        }
      }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(storeName));
    } catch (error) {
        console.error("Failed to save store name to localStorage", error);
    }
  }, [storeName]);
  
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WHATSAPP, JSON.stringify(whatsapp));
    } catch (error) {
        console.error("Failed to save whatsapp to localStorage", error);
    }
  }, [whatsapp]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_INSTAGRAM, JSON.stringify(instagram));
    } catch (error) {
        console.error("Failed to save instagram to localStorage", error);
    }
  }, [instagram]);

  useEffect(() => {
    try {
        if(events.length > 0){
          localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY_EVENTS);
        }
    } catch (error) {
        console.error("Failed to save events to localStorage", error);
    }
  }, [events]);


  const showSameThemeSwitch = useMemo(() => {
    return events.some(event => event.predefinedEvent === 'happy_sabado');
  }, [events]);

  const activeEvents = useMemo(() => {
    return events.filter((e: EventData) => e.isActive);
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...activeEvents].sort((a: EventData, b: EventData) => {
      const dateA = new Date(`${a.date}T${a.startTime || "00:00"}`);
      const dateB = new Date(`${b.date}T${b.startTime || "00:00"}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [activeEvents]);

  const monthOfEvents = useMemo(() => {
    if (sortedEvents.length > 0) {
      try {
        const firstEventDate = new Date(sortedEvents[0].date + "T00:00:00");
        return firstEventDate.toLocaleDateString("pt-BR", { month: "long" });
      } catch {
        return "";
      }
    }
    return "";
  }, [sortedEvents]);

  const enhancedEvents = useMemo(() => {
    const happySabados = sortedEvents.filter(
      (e: EventData) => e.predefinedEvent === "happy_sabado",
    );
    const otherEvents = sortedEvents.filter(
      (e: EventData) => e.predefinedEvent !== "happy_sabado",
    );

    if (isSameThemeAllMonth && happySabados.length > 0) {
        const firstHappySabado = happySabados[0];
        const themeTitle = `Happy Sábado - ${firstHappySabado.subtitle}`;
        const themeDescription = `Todos os sábados do mês de ${monthOfEvents}.\n${firstHappySabado.description}`;
        
        const unifiedHappySabadoEvent: EventData = {
            ...firstHappySabado,
            id: 'unified_happy_sabado',
            title: themeTitle,
            description: themeDescription,
            date: '', // No individual date
            startTime: '', // No individual time
            endTime: '',
            isActive: true,
        };
        
        const processedHappySabados = [unifiedHappySabadoEvent];

        const combinedEvents = [...otherEvents, ...processedHappySabados];

        return combinedEvents.sort((a, b) => {
            const isAUnified = a.id === 'unified_happy_sabado';
            const isBUnified = b.id === 'unified_happy_sabado';
            
            if(isAUnified) return 1;
            if(isBUnified) return -1;
            
            const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });

    } else {
      return sortedEvents.map((event: EventData) => ({
        ...event,
        title:
          event.predefinedEvent === "happy_sabado"
            ? `Happy Sábado - ${event.subtitle}`
            : event.title,
      }));
    }
  }, [sortedEvents, isSameThemeAllMonth, monthOfEvents]);

  const handleAddEvent = () => {
    if (events.length < MAX_EVENTS) {
      setEvents([...events, {
        id: `evt_${Math.random()}`,
        title: ``,
        subtitle: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '20:00',
        description: '',
        predefinedEvent: 'outro',
        isActive: true,
        timeFormat: 'range',
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
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 no-print">
           <h1 className="text-3xl sm:text-4xl font-bold text-[#E10098] font-headline drop-shadow-sm">
             Gerador de Cupons Ri Happy
           </h1>
           <p className="text-muted-foreground mt-2 font-medium">Crie informativos profissionais para sua loja.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="no-print space-y-6">
            <Card className="shadow-sm border-none ring-1 ring-gray-200">
              <CardHeader className="bg-white rounded-t-lg border-b pb-4">
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                  <div className="h-8 w-1.5 bg-[#FFD700] rounded-full" />
                  Informações da Loja
                </CardTitle>
                <CardDescription>Estes dados serão usados em todos os cupons.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-gray-700">Nome da Unidade</Label>
                  <Input 
                    id="storeName" 
                    value={storeName} 
                    onChange={(e) => setStoreName(e.target.value)} 
                    placeholder="Ex: Carioca Shopping"
                    className="bg-gray-50 border-gray-200 focus:ring-[#E10098]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-gray-700">WhatsApp</Label>
                    <Input 
                      id="whatsapp" 
                      value={whatsapp} 
                      onChange={(e) => setWhatsapp(e.target.value)} 
                      placeholder="(21) 99999-8888"
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-gray-700">Instagram</Label>
                    <Input 
                      id="instagram" 
                      value={instagram} 
                      onChange={(e) => setInstagram(e.target.value)} 
                      placeholder="@rihappy"
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {viewMode === 'events' && (
              <Card className="shadow-sm border-none ring-1 ring-gray-200">
                <CardHeader className="bg-white rounded-t-lg border-b pb-4">
                  <CardTitle className="text-xl font-headline flex items-center gap-2">
                    <div className="h-8 w-1.5 bg-[#E10098] rounded-full" />
                    Gerenciar Eventos
                  </CardTitle>
                  <CardDescription>Adicione até {MAX_EVENTS} eventos para o cupom de programação.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {showSameThemeSwitch && (
                    <div className="flex items-center space-x-2 py-3 mb-6 bg-yellow-50 border border-yellow-100 px-4 rounded-xl">
                      <Switch
                        id="same-theme-switch"
                        checked={isSameThemeAllMonth}
                        onCheckedChange={setIsSameThemeAllMonth}
                      />
                      <Label htmlFor="same-theme-switch" className="cursor-pointer text-sm font-semibold text-yellow-800">
                        Unificar todos os sábados em um único bloco temático
                      </Label>
                    </div>
                  )}
                  
                  <Accordion type="multiple" defaultValue={events.map(e => e.id!)} className="w-full space-y-3">
                    {events.map((eventData) => (
                      <AccordionItem value={eventData.id!} key={eventData.id} className="border-none">
                        <div className={`border rounded-xl transition-all ${eventData.isActive ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50 opacity-80'}`}>
                            <AccordionTrigger className="p-4 hover:no-underline">
                              <div className="flex-1 text-left flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${eventData.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-400'}`} />
                                <div>
                                  <p className="font-bold text-gray-800">{eventData.title || "Novo Evento"}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                      {eventData.isActive ? 'Evento visível no cupom' : 'Oculto na impressão'}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="border-t border-gray-100 p-4">
                                <EventForm 
                                  onDataChange={(data) => handleDataChange(eventData.id!, data)} 
                                  initialData={eventData}
                                  onRemove={() => handleRemoveEvent(eventData.id!)}
                                  showRemoveButton={events.length > 1}
                                  isSameThemeAllMonth={isSameThemeAllMonth && eventData.predefinedEvent === 'happy_sabado'}
                                />
                              </div>
                            </AccordionContent>
                          </div>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {events.length < MAX_EVENTS && (
                    <Button 
                      onClick={handleAddEvent} 
                      className="w-full mt-8 py-8 border-dashed border-2 bg-white text-gray-500 hover:bg-[#E10098]/5 hover:text-[#E10098] hover:border-[#E10098] transition-all rounded-2xl" 
                      variant="outline"
                    >
                      <PlusCircle className="mr-3 h-6 w-6" />
                      <span className="text-base font-bold">Adicionar Novo Evento</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {viewMode === 'discount' && (
              <Card className="shadow-sm border-none ring-1 ring-gray-200 bg-[#E10098]/5">
                <CardHeader>
                   <CardTitle className="text-[#E10098]">Cupom de 10% OFF</CardTitle>
                   <CardDescription>Ideal para oferecer como bônus na retirada de pedidos online.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>

          <div className="flex flex-col items-center justify-start gap-8 lg:sticky lg:top-8">
            <div className="no-print flex flex-col sm:flex-row p-1 bg-gray-200 rounded-2xl w-full max-w-md gap-1">
                <button 
                  onClick={() => setViewMode('events')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'events' ? 'bg-white shadow-sm text-[#E10098]' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    <CalendarDays className="h-4 w-4" />
                    Eventos
                </button>
                <button 
                  onClick={() => setViewMode('discount')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'discount' ? 'bg-white shadow-sm text-[#E10098]' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    <TicketPercent className="h-4 w-4" />
                    Cupom 10%
                </button>
            </div>

            <div id="print-container" className="shadow-2xl rounded-sm">
              {viewMode === 'events' ? (
                  <PrintContainer
                    storeName={storeName}
                    events={enhancedEvents}
                    whatsapp={whatsapp}
                    instagram={instagram}
                  />
              ) : (
                  <DiscountCoupon storeName={storeName} />
              )}
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 no-print">
              <Button onClick={() => window.print()} className="w-full bg-[#E10098] hover:bg-[#C00082] text-white py-8 rounded-2xl shadow-lg shadow-[#E10098]/20" size="lg">
                <Printer className="mr-3 h-6 w-6" />
                <span className="text-lg font-bold">Imprimir Informativo</span>
              </Button>
              <p className="text-center text-xs text-muted-foreground font-medium">O documento será formatado automaticamente para sua impressora térmica.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
