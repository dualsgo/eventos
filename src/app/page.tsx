"use client";

import { useState, useMemo, useEffect } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintContainer } from '@/components/print-container';
import { DiscountCoupon } from '@/components/discount-coupon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer, CalendarDays, TicketPercent, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ExchangeSeal } from '@/components/exchange-seal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAX_EVENTS = 4;
const LOCAL_STORAGE_KEY_STORE = "eventPrinter.storeName";
const LOCAL_STORAGE_KEY_WHATSAPP = "eventPrinter.whatsapp";
const LOCAL_STORAGE_KEY_INSTAGRAM = "eventPrinter.instagram";
const LOCAL_STORAGE_KEY_EVENTS = "eventPrinter.events";

type ViewMode = 'events' | 'discount' | 'exchange_seal';

export const STORES = [
  { code: "1030", name: "NOVA AMÉRICA" },
  { code: "1033", name: "NORTESHOPPING" },
  { code: "1052", name: "BANGU" },
  { code: "1057", name: "IGUATEMI RJ" },
  { code: "1058", name: "VIA PARQUE" },
  { code: "1072", name: "GRANDE RIO" },
  { code: "1078", name: "ILHA PLAZA" },
  { code: "1101", name: "PARTEGE SÃO GONÇALO" },
  { code: "1106", name: "SHOPPING METROPOLITANO BARRA" },
  { code: "1141", name: "AMÉRICA SHOPPING" },
  { code: "1169", name: "NOVA IGUAÇU" },
  { code: "1187", name: "CARIOCA SHOPPING" },
  { code: "1224", name: "TOP SHOPPING" },
  { code: "1232", name: "BARRA SHOPPING" },
  { code: "1239", name: "SHOPPING RECREIO" },
  { code: "1300", name: "ECO VILLA" },
  { code: "1301", name: "IPANEMA" },
  { code: "1304", name: "PARK JACAREPAGUÁ" },
  { code: "1335", name: "PLAZA NITERÓI" },
  { code: "1337", name: "PARQUE CAMPO GRANDE" },
  { code: "9014", name: "RIO DESIGN" },
  { code: "9094", name: "BARRA SHOPPING" },
];

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
  timeFormat: 'range',
};

export default function Home() {
  const [storeName, setStoreName] = useState('LOJA X');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("exchange_seal");
  const [exchangeOrigin, setExchangeOrigin] = useState<'ADD PICKUP' | 'Site'>('ADD PICKUP');
  const [exchangeStore, setExchangeStore] = useState('1030');

  useEffect(() => {
    try {
      const savedStoreName = localStorage.getItem(LOCAL_STORAGE_KEY_STORE);
      if (savedStoreName) setStoreName(JSON.parse(savedStoreName));
      const savedWhatsapp = localStorage.getItem(LOCAL_STORAGE_KEY_WHATSAPP);
      if (savedWhatsapp) setWhatsapp(JSON.parse(savedWhatsapp));
      const savedInstagram = localStorage.getItem(LOCAL_STORAGE_KEY_INSTAGRAM);
      if (savedInstagram) setInstagram(JSON.parse(savedInstagram));
      
      const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        if (parsedEvents && parsedEvents.length > 0) {
          setEvents(parsedEvents);
        }
      }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(storeName));
    localStorage.setItem(LOCAL_STORAGE_KEY_WHATSAPP, JSON.stringify(whatsapp));
    localStorage.setItem(LOCAL_STORAGE_KEY_INSTAGRAM, JSON.stringify(instagram));
    localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [storeName, whatsapp, instagram, events]);

  useEffect(() => {
    document.body.classList.remove('print-events', 'print-discount', 'print-exchange_seal');
    document.body.classList.add(`print-${viewMode}`);
  }, [viewMode]);

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
            date: '',
            startTime: '',
            endTime: '',
            isActive: true,
        };
        
        return [...otherEvents, unifiedHappySabadoEvent].sort((a, b) => {
            if(a.id === 'unified_happy_sabado') return 1;
            if(b.id === 'unified_happy_sabado') return -1;
            const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });
    } else {
      return sortedEvents.map((event: EventData) => ({
        ...event,
        title: event.predefinedEvent === "happy_sabado" ? `Happy Sábado - ${event.subtitle}` : event.title,
      }));
    }
  }, [sortedEvents, isSameThemeAllMonth, monthOfEvents]);

  const handleAddEvent = () => {
    if (events.length < MAX_EVENTS) {
      const newEvent: EventData = {
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
    setEvents(prev => prev.map(e => e.id === id ? data : e));
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(prev => prev.filter((e) => e.id !== id));
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-zinc-50/50 p-4 sm:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">


        <div className="grid grid-cols-1 lg:grid-cols-[1fr,450px] gap-8 xl:gap-12 items-start">
          <div className="no-print space-y-8">
            <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl transition-all hover:bg-white/80 rounded-2xl">
              <CardHeader className="border-b border-zinc-100 pb-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                  Informações da Loja
                </CardTitle>
                <CardDescription className="text-zinc-500">Estes dados serão usados no cabeçalho dos cupons.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-zinc-700 font-semibold text-sm">Nome da Unidade</Label>
                  <Input 
                    id="storeName" 
                    value={storeName} 
                    onChange={(e) => setStoreName(e.target.value)} 
                    placeholder="Ex: Carioca Shopping"
                    className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-11"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-zinc-700 font-semibold text-sm">WhatsApp</Label>
                    <Input 
                      id="whatsapp" 
                      value={whatsapp} 
                      onChange={(e) => setWhatsapp(e.target.value)} 
                      placeholder="(21) 99999-8888"
                      className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-zinc-700 font-semibold text-sm">Instagram</Label>
                    <Input 
                      id="instagram" 
                      value={instagram} 
                      onChange={(e) => setInstagram(e.target.value)} 
                      placeholder="@rihappy"
                      className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {viewMode === 'events' && (
              <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl rounded-2xl">
                <CardHeader className="border-b border-zinc-100 pb-5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                    Gerenciar Eventos
                  </CardTitle>
                  <CardDescription className="text-zinc-500">Adicione até {MAX_EVENTS} eventos. Apenas os ativos serão impressos.</CardDescription>
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
                  
                  <Accordion type="multiple" className="w-full space-y-4">
                    {events.map((eventData) => (
                      <AccordionItem value={eventData.id!} key={eventData.id} className="border-none">
                        <div className={`border rounded-2xl transition-all shadow-sm ${eventData.isActive ? 'border-zinc-200 bg-white' : 'border-dashed border-zinc-200 bg-zinc-50/50 opacity-70'}`}>
                            <AccordionTrigger className="px-5 py-4 hover:no-underline rounded-2xl">
                              <div className="flex-1 text-left flex items-center gap-4">
                                <div className={`h-2.5 w-2.5 rounded-full ${eventData.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-300'}`} />
                                <div>
                                  <p className="font-semibold text-zinc-800 text-sm">{eventData.title || "Novo Evento"}</p>
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
                      className="w-full mt-6 py-6 border-dashed border-2 bg-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300 transition-all rounded-2xl shadow-none" 
                      variant="outline"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      <span className="text-sm font-semibold">Adicionar Novo Evento</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {viewMode === 'discount' && (
              <Card className="shadow-sm border-none ring-1 ring-gray-200 bg-[#E10098]/5">

                <CardContent className="pt-4">
                    <div className="bg-[#E10098]/5 rounded-2xl p-6 border border-[#E10098]/10 text-[#E10098]">
                      <p className="font-bold flex items-center gap-2 mb-4">
                         <TicketPercent className="h-5 w-5" />
                         Boas Práticas
                      </p>
                      <ul className="space-y-3 text-sm font-medium leading-tight list-disc pl-5">
                        <li>Avise o cliente sobre o desconto assim que identificar que se trata de uma retirada de pedido online.</li>
                        <li>Se possível, verifique o produto que está sendo retirado antes de buscá-lo no estoque para oferecer um complemento.</li>
                        <li>Grampeie o cupom na frente do termo de retirada para o cliente visualizar enquanto assina.</li>
                        <li>Reforce que o benefício é exclusivo e imediato, válido apenas para o momento.</li>
                      </ul>
                    </div>
                </CardContent>
              </Card>
            )}

            {viewMode === 'exchange_seal' && (
              <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl rounded-2xl">
                <CardHeader className="border-b border-zinc-100 pb-5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                    Configurar Selo Troca
                  </CardTitle>
                  <CardDescription className="text-zinc-500">Selecione a origem e a unidade da loja.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-700 font-semibold text-sm">Origem</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['ADD PICKUP', 'Site'] as const).map((origin) => (
                        <button
                          key={origin}
                          onClick={() => setExchangeOrigin(origin)}
                          className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${exchangeOrigin === origin ? 'border-[#E10098] bg-[#E10098]/10 text-[#E10098]' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}
                        >
                          {origin}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exchangeStore" className="text-zinc-700 font-semibold text-sm">Loja (4 dígitos)</Label>
                    <Select value={exchangeStore} onValueChange={setExchangeStore}>
                      <SelectTrigger className="h-11 bg-white/50 border-zinc-200 rounded-xl">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {STORES.map((store) => (
                          <SelectItem key={store.code} value={store.code}>
                            {store.code} - {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col items-center justify-start gap-6 lg:sticky lg:top-8 w-full">
            <div className="no-print flex p-1.5 bg-zinc-200/50 backdrop-blur-md rounded-2xl w-full max-w-sm gap-1 border border-zinc-200/50 shadow-inner">
                <button 
                  onClick={() => setViewMode('events')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${viewMode === 'events' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <CalendarDays className="h-4 w-4" />
                    Eventos
                </button>
                <button 
                  onClick={() => setViewMode('discount')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${viewMode === 'discount' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <TicketPercent className="h-4 w-4" />
                    Cupom 10%
                </button>
                <button 
                  onClick={() => setViewMode('exchange_seal')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${viewMode === 'exchange_seal' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <Info className="h-4 w-4" />
                    Selo Troca
                </button>
            </div>

            <div id="print-container" className="w-full lg:w-[450px] overflow-x-auto no-scrollbar origin-top md:scale-100 flex justify-center shrink-0 py-4">
              {viewMode === 'exchange_seal' && (
                <style>{`
                  @media print {
                    @page { 
                      size: 110mm 50mm !important; 
                      margin: 0 !important;
                    }
                    #print-container {
                      width: 110mm !important;
                      height: 50mm !important;
                      display: flex !important;
                      justify-content: center !important;
                      align-items: center !important;
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      overflow: hidden !important;
                    }
                  }
                `}</style>
              )}
              {viewMode === 'events' ? (
                  <PrintContainer
                    storeName={storeName}
                    events={enhancedEvents}
                    whatsapp={whatsapp}
                    instagram={instagram}
                  />
              ) : viewMode === 'discount' ? (
                  <DiscountCoupon storeName={storeName} />
              ) : (
                  <ExchangeSeal origin={exchangeOrigin} storeCode={exchangeStore} />
              )}
            </div>

            <div className="flex w-full max-w-[450px] flex-col gap-4 no-print mt-2">

              
              <Button onClick={() => window.print()} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-6 rounded-2xl shadow-lg transition-transform active:scale-[0.98]" size="lg">
                <Printer className="mr-3 h-5 w-5" />
                <span className="text-base font-semibold">Imprimir Agora</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}