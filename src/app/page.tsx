"use client";

import { useState, useMemo, useEffect } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintContainer } from '@/components/print-container';
import { DiscountCoupon } from '@/components/discount-coupon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const MAX_EVENTS = 4;
const LOCAL_STORAGE_KEY_STORE = "eventPrinter.storeName";
const LOCAL_STORAGE_KEY_WHATSAPP = "eventPrinter.whatsapp";
const LOCAL_STORAGE_KEY_INSTAGRAM = "eventPrinter.instagram";
const LOCAL_STORAGE_KEY_EVENTS = "eventPrinter.events";

type ViewMode = 'events' | 'discount';

const initialEvent: EventData = {
  id: `evt_${Math.random()}`,
  title: "Exemplo de Evento",
  subtitle: "",
  date: new Date().toISOString().split("T")[0],
  startTime: "14:00",
  endTime: "18:00",
  description:
    "Uma breve descrição do evento que será impresso no papel térmico.",
  predefinedEvent: "outro",
  isActive: true,
};

export default function Home() {
  const [storeName, setStoreName] = useState("LOJA X");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("events");

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedStoreName = localStorage.getItem(LOCAL_STORAGE_KEY_STORE);
      if (savedStoreName) {
        setStoreName(JSON.parse(savedStoreName));
      }
      const savedWhatsapp = localStorage.getItem(LOCAL_STORAGE_KEY_WHATSAPP);
      if (savedWhatsapp) {
        setWhatsapp(JSON.parse(savedWhatsapp));
      }
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
        // If there's an error, we'll just use the default state
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(storeName));
    } catch (error) {
      console.error("Failed to save store name to localStorage", error);
    }
  }, [storeName]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_WHATSAPP,
        JSON.stringify(whatsapp),
      );
    } catch (error) {
      console.error("Failed to save whatsapp to localStorage", error);
    }
  }, [whatsapp]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_INSTAGRAM,
        JSON.stringify(instagram),
      );
    } catch (error) {
      console.error("Failed to save instagram to localStorage", error);
    }
  }, [instagram]);

  useEffect(() => {
    try {
        if(events.length > 0){
          localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
        } else {
          // Clear localStorage if all events are removed
          localStorage.removeItem(LOCAL_STORAGE_KEY_EVENTS);
        }
    } catch (error) {
      console.error("Failed to save events to localStorage", error);
    }
  }, [events]);

  const showSameThemeSwitch = useMemo(() => {
    return events.some((event: EventData) => event.predefinedEvent === "happy_sabado");
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

      return combinedEvents.sort((a: EventData, b: EventData) => {
        const isAUnified = a.id === "unified_happy_sabado";
        const isBUnified = b.id === "unified_happy_sabado";

        if (isAUnified) return 1;
        if (isBUnified) return -1;

        const dateA = new Date(`${a.date}T${a.startTime || "00:00"}`);
        const dateB = new Date(`${b.date}T${b.startTime || "00:00"}`);
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
      const newEvent: EventData = {
        id: `evt_${Math.random()}`,
        title: ``,
        subtitle: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "14:00",
        endTime: "20:00",
        description: "",
        predefinedEvent: "outro",
        isActive: true,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDataChange = (id: string, data: EventData) => {
    const newEvents = events.map((e: EventData) => (e.id === id ? data : e));
    setEvents(newEvents);
  };

  const handleRemoveEvent = (id: string) => {
    const newEvents = events.filter((e: EventData) => e.id !== id);
    setEvents(newEvents);
  };

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8 no-print">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">
              Gerador de Cupons Ri Happy
            </h1>
            <p className="text-muted-foreground mt-2">
              Crie, edite e visualize cupons para impressão.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="no-print w-full">
              <CardHeader>
                <CardTitle className="font-headline">
                  Informações Gerais
                </CardTitle>
                <CardDescription>
                  Estes dados serão usados em todos os cupons gerados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(e.target.value)}
                    placeholder="Ex: Carioca Shopping"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp da Loja</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsapp(e.target.value)}
                      placeholder="Ex: (21) 99999-8888"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram da Loja</Label>
                    <Input
                      id="instagram"
                      value={instagram}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstagram(e.target.value)}
                      placeholder="Ex: @rihappy"
                    />
                  </div>
                </div>

                {viewMode === "events" && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <CardHeader className="px-0 pb-2 pt-0">
                        <CardTitle className="font-headline">
                          Eventos da Loja
                        </CardTitle>
                        <CardDescription>
                          Adicione ou edite os eventos que aparecerão no cupom.
                        </CardDescription>
                      </CardHeader>

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
                    
                    <Accordion type="multiple" defaultValue={events.map(e => e.id!)} className="w-full pt-4">
                      {events.map((eventData) => (
                        <AccordionItem value={eventData.id!} key={eventData.id} className="border-b-0">
                          <div className="border rounded-lg mb-4">
                              <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex-1 text-left">
                                  <p className="font-semibold">
                                    {eventData.title || "Novo Evento"}
                                  </p>
                                  <p
                                    className={`text-sm ${eventData.isActive ? "text-green-600" : "text-muted-foreground"}`}
                                  >
                                    {eventData.isActive ? "Ativo" : "Inativo"}
                                  </p>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="border-t p-4">
                                  <EventForm
                                    onDataChange={(data) =>
                                      handleDataChange(eventData.id!, data)
                                    }
                                    initialData={eventData}
                                    onRemove={() =>
                                      handleRemoveEvent(eventData.id!)
                                    }
                                    showRemoveButton={events.length > 1}
                                    isSameThemeAllMonth={
                                      isSameThemeAllMonth &&
                                      eventData.predefinedEvent ===
                                        "happy_sabado"
                                    }
                                  />
                                </div>
                              </AccordionContent>
                            </div>
                          </AccordionItem>
                        ))}
                      </Accordion>

                    {events.length < MAX_EVENTS && (
                      <Button onClick={handleAddEvent} className="w-full mt-4" variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Evento
                      </Button>
                    )}
                </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-start gap-6 lg:sticky lg:top-8">
            <div className="no-print flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs">
                <Button onClick={() => setViewMode('events')} variant={viewMode === 'events' ? 'default' : 'outline'} className="w-full">
                    Eventos
                </Button>
                <Button onClick={() => setViewMode('discount')} variant={viewMode === 'discount' ? 'default' : 'outline'} className="w-full">
                    Cupom Desconto
                </Button>
            </div>

            <div id="print-container">
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

              <div className="flex w-full max-w-xs items-center gap-2 no-print">
                <Button
                  onClick={() => window.print()}
                  className="flex-grow"
                  size="lg"
                  variant="default"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
