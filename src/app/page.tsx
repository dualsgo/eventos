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
  const [selectedStoreCode, setSelectedStoreCode] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("exchange_seal");
  const [exchangeOrigin, setExchangeOrigin] = useState<'ADD PICKUP' | 'Site'>('ADD PICKUP');

  // Derive store name for components that need it
  const storeName = useMemo(() => {
    const store = STORES.find(s => s.code === selectedStoreCode);
    return store ? store.name : '';
  }, [selectedStoreCode]);

  useEffect(() => {
    try {
      const savedStoreCode = localStorage.getItem(LOCAL_STORAGE_KEY_STORE);
      if (savedStoreCode) setSelectedStoreCode(JSON.parse(savedStoreCode));
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
    localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(selectedStoreCode));
    localStorage.setItem(LOCAL_STORAGE_KEY_WHATSAPP, JSON.stringify(whatsapp));
    localStorage.setItem(LOCAL_STORAGE_KEY_INSTAGRAM, JSON.stringify(instagram));
    localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [selectedStoreCode, whatsapp, instagram, events]);

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
    <main className="flex min-h-screen w-full flex-col items-center bg-[#FFD200]/5 p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-5%] right-[-5%] opacity-[0.03] pointer-events-none no-print">
        <img src="/assets/elemento-52.png" alt="" className="w-[500px]" />
      </div>
      <div className="absolute bottom-[-10%] left-[-5%] opacity-[0.03] pointer-events-none no-print">
        <img src="/assets/elemento-30.png" alt="" className="w-[600px]" />
      </div>
      <div className="absolute top-[20%] left-[-10%] opacity-[0.02] pointer-events-none no-print rotate-12">
        <img src="/assets/elemento-18.png" alt="" className="w-[400px]" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto relative z-10">
        
        {/* HEADER BRANDING */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 no-print gap-6">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-800 tracking-tighter uppercase">Gerador de <span className="text-[#E10098]">Cupons</span></h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10 items-start">
          
          {/* COLUNA 1: IDENTIFICAÇÃO */}
          <div className="no-print space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-[#E10098] flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_10px_rgba(225,0,152,0.3)]">1</div>
              <h2 className="text-xl font-bold text-zinc-800">Identificação</h2>
            </div>
            
            <Card className="shadow-xl shadow-zinc-200/50 border-none bg-white/80 backdrop-blur-xl transition-all hover:bg-white rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <img src="/assets/elemento-19.png" alt="" className="w-20" />
              </div>
              <CardHeader className="border-b border-zinc-100 pb-5 bg-white/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                  Unidade
                </CardTitle>
                <CardDescription className="text-zinc-500">Dados obrigatórios para o cabeçalho.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="storeSelect" className="text-zinc-700 font-bold text-xs uppercase tracking-wider">Loja Ri Happy</Label>
                  <Select value={selectedStoreCode} onValueChange={setSelectedStoreCode}>
                    <SelectTrigger id="storeSelect" className="h-12 bg-white border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-2xl shadow-sm font-semibold">
                      <SelectValue placeholder="Selecione a unidade..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-200 shadow-xl">
                      {STORES.map((store) => (
                        <SelectItem key={store.code} value={store.code} className="py-3 focus:bg-[#E10098]/5 focus:text-[#E10098] rounded-xl cursor-pointer">
                          {store.code} - {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-zinc-700 font-bold text-xs uppercase tracking-wider">WhatsApp da Unidade</Label>
                    <Input 
                      id="whatsapp" 
                      value={whatsapp} 
                      onChange={(e) => setWhatsapp(e.target.value)} 
                      placeholder="(21) 99999-8888"
                      className="bg-white border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-2xl h-12 shadow-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-zinc-700 font-bold text-xs uppercase tracking-wider">Instagram</Label>
                    <Input 
                      id="instagram" 
                      value={instagram} 
                      onChange={(e) => setInstagram(e.target.value)} 
                      placeholder="@rihappy"
                      className="bg-white border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-2xl h-12 shadow-sm font-medium"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {!selectedStoreCode && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4 text-amber-800 shadow-sm animate-pulse">
                <Info className="h-6 w-6 shrink-0 mt-0.5 text-amber-600" />
                <p className="text-sm font-bold leading-tight uppercase tracking-tight">Atenção: Selecione uma loja para começar.</p>
              </div>
            )}
          </div>

          {/* COLUNA 2: CONFIGURAÇÃO */}
          <div className="no-print space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-[#E10098] flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_10px_rgba(225,0,152,0.3)]">2</div>
              <h2 className="text-xl font-bold text-zinc-800">Configuração</h2>
            </div>

            <div className="no-print flex p-2 bg-zinc-200/40 backdrop-blur-md rounded-[24px] w-full gap-2 border border-white shadow-xl">
                <button 
                  onClick={() => setViewMode('exchange_seal')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all duration-300 ${viewMode === 'exchange_seal' ? 'bg-[#E10098] text-white shadow-lg shadow-[#E10098]/30 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'}`}
                >
                    <Info className="h-4 w-4" />
                    Selo Troca
                </button>
                <button 
                  onClick={() => setViewMode('events')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all duration-300 ${viewMode === 'events' ? 'bg-[#E10098] text-white shadow-lg shadow-[#E10098]/30 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'}`}
                >
                    <CalendarDays className="h-4 w-4" />
                    Eventos
                </button>
                <button 
                  onClick={() => setViewMode('discount')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all duration-300 ${viewMode === 'discount' ? 'bg-[#E10098] text-white shadow-lg shadow-[#E10098]/30 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'}`}
                >
                    <TicketPercent className="h-4 w-4" />
                    Cupom
                </button>
            </div>

            {viewMode === 'events' && (
              <Card className="shadow-xl shadow-zinc-200/50 border-none bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-zinc-100 pb-5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                    Gerenciar Eventos
                  </CardTitle>
                  <CardDescription className="text-zinc-500">Adicione até {MAX_EVENTS} eventos.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {showSameThemeSwitch && (
                    <div className="flex items-center space-x-2 py-4 mb-6 bg-yellow-50 border border-yellow-200 px-5 rounded-2xl shadow-sm">
                      <Switch
                        id="same-theme-switch"
                        checked={isSameThemeAllMonth}
                        onCheckedChange={setIsSameThemeAllMonth}
                        className="data-[state=checked]:bg-[#E10098]"
                      />
                      <Label htmlFor="same-theme-switch" className="cursor-pointer text-sm font-bold text-yellow-800 uppercase tracking-tight">
                        Unificar todos os sábados do mês
                      </Label>
                    </div>
                  )}
                  
                  <Accordion type="multiple" className="w-full space-y-4">
                    {events.map((eventData) => (
                      <AccordionItem value={eventData.id!} key={eventData.id} className="border-none">
                        <div className={`border-2 rounded-[22px] transition-all duration-300 ${eventData.isActive ? 'border-zinc-100 bg-white shadow-sm' : 'border-dashed border-zinc-200 bg-zinc-50/50 opacity-70'}`}>
                            <AccordionTrigger className="px-5 py-4 hover:no-underline rounded-[20px] group">
                              <div className="flex-1 text-left flex items-center gap-4">
                                <div className={`h-3 w-3 rounded-full transition-all duration-300 ${eventData.isActive ? 'bg-[#E10098] shadow-[0_0_12px_rgba(225,0,152,0.6)] scale-110' : 'bg-zinc-300'}`} />
                                <div>
                                  <p className="font-bold text-zinc-800 text-sm group-hover:text-[#E10098] transition-colors">{eventData.title || "Novo Evento"}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="border-t border-zinc-50 p-5 bg-zinc-50/30">
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
                      className="w-full mt-6 py-7 border-dashed border-2 bg-zinc-50/50 text-zinc-500 hover:bg-white hover:text-[#E10098] hover:border-[#E10098] transition-all rounded-[22px] shadow-none group" 
                      variant="outline"
                    >
                      <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="text-sm font-bold uppercase tracking-wider">Novo Evento</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {viewMode === 'discount' && (
              <Card className="shadow-xl shadow-zinc-200/50 border-none bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-[-20px] right-[-20px] opacity-10 pointer-events-none">
                  <img src="/assets/elemento-32.png" alt="" className="w-40" />
                </div>
                <CardHeader className="border-b border-zinc-100 pb-5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800 uppercase tracking-tighter">
                    Instruções de Uso
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="bg-[#E10098]/5 rounded-3xl p-6 border border-[#E10098]/10 text-[#E10098] relative overflow-hidden">
                      <p className="font-black flex items-center gap-2 mb-5 text-sm uppercase tracking-widest">
                         <TicketPercent className="h-5 w-5" />
                         Checklist do Sucesso
                      </p>
                      <ul className="space-y-5 text-sm font-bold leading-tight">
                        <li className="flex gap-3 items-start italic">
                          <span className="h-5 w-5 rounded-full bg-[#E10098] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-lg shadow-[#E10098]/20">1</span>
                          Avise o cliente sobre o desconto assim que identificar a retirada.
                        </li>
                        <li className="flex gap-3 items-start italic">
                          <span className="h-5 w-5 rounded-full bg-[#E10098] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-lg shadow-[#E10098]/20">2</span>
                          Verifique o produto antes de buscá-lo para oferecer complemento.
                        </li>
                        <li className="flex gap-3 items-start italic">
                          <span className="h-5 w-5 rounded-full bg-[#E10098] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-lg shadow-[#E10098]/20">3</span>
                          Grampeie o cupom na frente do termo de retirada.
                        </li>
                        <li className="flex gap-3 items-start italic">
                          <span className="h-5 w-5 rounded-full bg-[#E10098] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-lg shadow-[#E10098]/20">4</span>
                          Reforce que o benefício é exclusivo e imediato.
                        </li>
                      </ul>
                    </div>
                </CardContent>
              </Card>
            )}

            {viewMode === 'exchange_seal' && (
              <Card className="shadow-xl shadow-zinc-200/50 border-none bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-[-10px] left-[-10px] opacity-10 pointer-events-none rotate-180">
                  <img src="/assets/elemento-48.png" alt="" className="w-32" />
                </div>
                <CardHeader className="border-b border-zinc-100 pb-5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                    Selo Troca
                  </CardTitle>
                  <CardDescription className="text-zinc-500 font-medium">Configuração rápida da origem.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label className="text-zinc-700 font-bold text-xs uppercase tracking-wider">Origem da Mercadoria</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['ADD PICKUP', 'Site'] as const).map((origin) => (
                        <button
                          key={origin}
                          onClick={() => setExchangeOrigin(origin)}
                          className={`py-4 px-4 rounded-2xl text-sm font-black uppercase tracking-tighter border-2 transition-all duration-300 ${exchangeOrigin === origin ? 'border-[#E10098] bg-[#E10098]/10 text-[#E10098] shadow-md scale-[1.02]' : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 bg-white'}`}
                        >
                          {origin}
                        </button>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            )}
          </div>

          {/* COLUNA 3: PREVIEW & PRINT */}
          <div className="flex flex-col items-center justify-start gap-6 lg:sticky lg:top-8 w-full">
            <div className="flex items-center gap-3 self-start mb-2 no-print">
              <div className="h-8 w-8 rounded-lg bg-[#E10098] flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_10px_rgba(225,0,152,0.3)]">3</div>
              <h2 className="text-xl font-bold text-zinc-800">Visualização</h2>
            </div>

            <div id="print-container" className="w-full overflow-x-auto no-scrollbar origin-top md:scale-100 flex justify-center shrink-0 py-6 relative bg-white rounded-[40px] shadow-2xl border-8 border-zinc-50">
              {!selectedStoreCode && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12 text-center rounded-[32px] no-print">
                  <div className="h-24 w-24 bg-[#FFD200]/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Printer className="h-10 w-10 text-[#E10098]" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-800 mb-3 uppercase tracking-tighter">Aguardando Seleção</h3>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed">Olá! Para gerar seu cupom, primeiro selecione sua unidade na coluna <span className="text-[#E10098] font-bold">Identificação</span>.</p>
                  
                  <div className="mt-8 opacity-20 grayscale">
                    <img src="/assets/elemento-54.png" alt="" className="w-24" />
                  </div>
                </div>
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
                  <ExchangeSeal origin={exchangeOrigin} storeCode={selectedStoreCode} />
              )}
            </div>

            <div className="flex w-full flex-col gap-4 no-print mt-2">
              <Button 
                onClick={() => window.print()} 
                disabled={!selectedStoreCode}
                className={`w-full py-8 rounded-[28px] shadow-2xl shadow-[#E10098]/20 transition-all active:scale-[0.98] ${selectedStoreCode ? 'bg-[#E10098] hover:bg-[#C00080] text-white scale-[1.01]' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`} 
                size="lg"
              >
                <Printer className="mr-3 h-6 w-6" />
                <span className="text-xl font-black uppercase tracking-tighter">Imprimir Agora</span>
              </Button>
              
              <div className="flex items-center justify-center gap-3 mt-2 text-zinc-400">
                 <div className="h-[1px] flex-1 bg-zinc-100" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Dica Técnica</p>
                 <div className="h-[1px] flex-1 bg-zinc-100" />
              </div>
              <p className="text-center text-[11px] text-zinc-400 font-bold leading-tight px-6 italic">
                "Confirme se a impressora térmica está pronta. Use papéis de 80mm para melhor resultado."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="w-full mt-20 py-10 no-print flex flex-col items-center gap-4 relative">
         <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
         <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em]">Gerador de Materiais de Ponto de Venda</p>
      </div>
    </main>
  );
}
