"use client";

import { useState, useMemo, useEffect } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintContainer } from '@/components/print-container';
import { DiscountCoupon } from '@/components/discount-coupon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer, CalendarDays, TicketPercent, Info, MessageSquare } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ExchangeSeal } from '@/components/exchange-seal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyInviteCoupon } from '@/components/survey-invite-coupon';
import { AgingLabel } from '@/components/aging-label';

const MAX_EVENTS = 4;
const LOCAL_STORAGE_KEY_STORE = "eventPrinter.storeName";
const LOCAL_STORAGE_KEY_BRAND = "eventPrinter.brand";
const LOCAL_STORAGE_KEY_WHATSAPP = "eventPrinter.whatsapp";
const LOCAL_STORAGE_KEY_INSTAGRAM = "eventPrinter.instagram";
const LOCAL_STORAGE_KEY_EVENTS = "eventPrinter.events";

type ViewMode = 'events' | 'discount' | 'exchange_seal' | 'survey_invite' | 'aging_label';

export type Brand = 'ri_happy' | 'pb_kids';

const BRAND_LABELS: Record<Brand, string> = {
  ri_happy: 'Ri Happy',
  pb_kids: 'PB Kids',
};

const STORES = [
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
  predefinedEvent: 'outro',  brand: 'ri_happy',  isActive: true,
  timeFormat: 'range',
};

export default function Home() {
  const [storeCode, setStoreCode] = useState('');
  const [customStore, setCustomStore] = useState('');
  const [brand, setBrand] = useState<Brand>('ri_happy');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("exchange_seal");
  const [exchangeOrigin, setExchangeOrigin] = useState<'ADD PICKUP' | 'Site' | 'AGG50'>('ADD PICKUP');

  const storeName = useMemo(() => {
    if (storeCode === 'OUTRA') {
      const parts = customStore.split('-');
      if (parts.length > 1) {
         return parts.slice(1).join('-').trim();
      }
      return customStore;
    }
    return STORES.find(s => s.code === storeCode)?.name || '';
  }, [storeCode, customStore]);

  const derivedStoreCode = useMemo(() => {
    if (storeCode === 'OUTRA') {
      const match = customStore.match(/^(\d{4})/);
      return match ? match[1] : '';
    }
    return storeCode;
  }, [storeCode, customStore]);

  const isPrintEnabled = viewMode === 'aging_label' || (storeCode === 'OUTRA' ? !!customStore : !!storeCode);

  useEffect(() => {
    try {
      const savedStoreNameOrCode = localStorage.getItem(LOCAL_STORAGE_KEY_STORE);
      if (savedStoreNameOrCode) {
        const parsed = JSON.parse(savedStoreNameOrCode);
        const isCode = STORES.some(s => s.code === parsed);
        if (isCode) {
          setStoreCode(parsed);
        } else {
          const found = STORES.find(s => s.name === parsed);
          if (found) {
            setStoreCode(found.code);
          } else if (parsed) {
            setStoreCode('OUTRA');
            setCustomStore(parsed);
          }
        }
      }
      const savedBrand = localStorage.getItem(LOCAL_STORAGE_KEY_BRAND);
      if (savedBrand) setBrand(JSON.parse(savedBrand));
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
    if (storeCode === 'OUTRA') {
      localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(customStore));
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(storeCode));
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_BRAND, JSON.stringify(brand));
    localStorage.setItem(LOCAL_STORAGE_KEY_WHATSAPP, JSON.stringify(whatsapp));
    localStorage.setItem(LOCAL_STORAGE_KEY_INSTAGRAM, JSON.stringify(instagram));
    localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [storeCode, customStore, brand, whatsapp, instagram, events]);

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

  const eventBrandLabel = (brand?: Brand) => {
    if (!brand) return "";
    return BRAND_LABELS[brand] || "";
  };

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
        brand: 'ri_happy',
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
    <main className="flex min-h-screen w-full flex-col items-center bg-zinc-50/50 p-4 sm:p-8 font-sans lg:overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] lg:sm:h-[calc(100vh-8rem)]">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr,450px] xl:grid-cols-[1fr,500px] gap-8 xl:gap-12 items-start h-full">
          <div className="no-print w-full space-y-8 lg:overflow-y-auto lg:pr-2 lg:h-full pb-10 custom-scrollbar">
            <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl transition-all hover:bg-white/80 rounded-2xl">
              <CardHeader className="border-b border-zinc-100 pb-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                  Informações da Loja
                </CardTitle>
                <CardDescription className="text-zinc-500">Estes dados serão usados no cabeçalho dos cupons.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-[1.5fr,1fr] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-zinc-700 font-semibold text-sm">Nome da Unidade</Label>
                    <Select value={storeCode} onValueChange={setStoreCode}>
                      <SelectTrigger className="h-11 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098]">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {STORES.map((store) => (
                          <SelectItem key={store.code} value={store.code}>
                            {store.code} - {store.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="OUTRA">OUTRA</SelectItem>
                      </SelectContent>
                    </Select>
                    {storeCode === 'OUTRA' && (
                      <Input 
                        value={customStore} 
                        onChange={(e) => setCustomStore(e.target.value)} 
                        placeholder="Ex: 1187 - CARIOCA SHOPPING"
                        className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-11 mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-zinc-700 font-semibold text-sm">Rede</Label>
                    <Select value={brand} onValueChange={(value) => setBrand(value as Brand)}>
                      <SelectTrigger className="h-11 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BRAND_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                  <p className="text-xs uppercase text-zinc-500 mt-0.5">{eventBrandLabel(eventData.brand)}</p>
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
                  <CardDescription className="text-zinc-500">Selecione a origem da troca.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-700 font-semibold text-sm">Origem</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['ADD PICKUP', 'Site', 'AGG50'] as const).map((origin) => {
                        const labels = {
                          'ADD PICKUP': 'Adicional Pickup',
                          'Site': 'Site',
                          'AGG50': 'AGING'
                        };
                        return (
                        <button
                          key={origin}
                          onClick={() => setExchangeOrigin(origin)}
                          className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${exchangeOrigin === origin ? 'border-[#E10098] bg-[#E10098]/10 text-[#E10098]' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}
                        >
                          {labels[origin]}
                        </button>
                      )})}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col items-center justify-start gap-6 lg:sticky lg:top-0 w-full lg:h-full lg:overflow-y-auto pb-10 custom-scrollbar">
            <div className="no-print grid grid-cols-2 md:grid-cols-4 p-1.5 bg-zinc-200/50 backdrop-blur-md rounded-2xl w-full gap-1 border border-zinc-200/50 shadow-inner">
                <button 
                  onClick={() => setViewMode('exchange_seal')} 
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${viewMode === 'exchange_seal' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <Info className="h-4 w-4 shrink-0" />
                    <span className="truncate">Selo Troca</span>
                </button>
                <button 
                  onClick={() => setViewMode('events')} 
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${viewMode === 'events' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="truncate">Eventos</span>
                </button>
                <button 
                  onClick={() => setViewMode('discount')} 
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${viewMode === 'discount' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <TicketPercent className="h-4 w-4 shrink-0" />
                    <span className="truncate">Cupom 10%</span>
                </button>
                <button 
                  onClick={() => setViewMode('survey_invite')} 
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${viewMode === 'survey_invite' ? 'bg-white shadow border border-zinc-200/50 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30'}`}
                >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate">Pesquisa</span>
                </button>
            </div>

            <div id="print-container" className="w-full lg:w-[450px] overflow-x-auto no-scrollbar origin-top scale-[0.85] sm:scale-100 flex justify-center shrink-0 py-4">
              {viewMode === 'aging_label' && (
                <style>{`
                  @media print {
                    @page { 
                      size: 100mm 15mm !important; 
                      margin: 0 !important;
                    }
                    #print-container {
                      width: 100mm !important;
                      height: 15mm !important;
                      display: flex !important;
                      justify-content: flex-start !important;
                      align-items: flex-start !important;
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      overflow: hidden !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                  }
                `}</style>
              )}
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
              {!isPrintEnabled && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center no-print">
                  <div className="h-16 w-16 bg-[#E10098]/10 rounded-full flex items-center justify-center mb-4">
                    <Info className="h-8 w-8 text-[#E10098]" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">Atenção!</h3>
                  <p className="text-sm text-zinc-500">Por favor, identifique a sua <b>unidade/loja</b> primeiro para habilitar a impressão.</p>
                </div>
              )}
              {viewMode === 'events' ? (
                  <PrintContainer
                    storeName={storeName}
                    events={enhancedEvents}
                    whatsapp={whatsapp}
                    instagram={instagram}
                    brand={brand}
                  />
              ) : viewMode === 'discount' ? (
                  <DiscountCoupon storeName={storeName} brand={brand} />
              ) : viewMode === 'survey_invite' ? (
                  <SurveyInviteCoupon 
                    storeCode={derivedStoreCode} 
                    storeName={storeName} 
                    brand={brand} 
                  />
              ) : viewMode === 'aging_label' ? (
                  <AgingLabel />
              ) : (
                  <ExchangeSeal origin={exchangeOrigin} storeCode={derivedStoreCode} />
              )}
            </div>

            <div className="flex w-full max-w-[450px] flex-col gap-4 no-print mt-2">

              
              <Button 
                onClick={() => window.print()} 
                disabled={!isPrintEnabled}
                className={`w-full py-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${isPrintEnabled ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`} 
                size="lg"
              >
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