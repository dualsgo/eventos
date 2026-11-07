"use client";

import { useState, useMemo, useEffect } from 'react';
import { EventForm, type EventData } from '@/components/event-form';
import { PrintContainer } from '@/components/print-container';
import { DiscountCoupon } from '@/components/discount-coupon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Printer, Download, CalendarDays, TicketPercent, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ExchangeSeal, type ExchangeOrigin } from '@/components/exchange-seal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyInviteCoupon } from '@/components/survey-invite-coupon';
import { useToast } from '@/hooks/use-toast';
import { STORE_CODES, getBrandFromStoreCode } from '@/data/stores';

const MAX_EVENTS = 4;
const LOCAL_STORAGE_KEY_STORE = "eventPrinter.storeCode";
const LOCAL_STORAGE_KEY_CUSTOM_STORE = "eventPrinter.customStore";
const LOCAL_STORAGE_KEY_BRAND = "eventPrinter.brand";
const LOCAL_STORAGE_KEY_WHATSAPP = "eventPrinter.whatsapp";
const LOCAL_STORAGE_KEY_EVENTS = "eventPrinter.events";

type ViewMode = 'exchange_seal' | 'events' | 'discount' | 'survey_invite';

export type Brand = 'ri_happy' | 'pb_kids';

const BRAND_LABELS: Record<Brand, string> = {
  ri_happy: 'Ri Happy',
  pb_kids: 'PB Kids',
};

const initialEvent: EventData = {
  id: `evt_${Math.random()}`,
  title: 'Exemplo de Evento',
  subtitle: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '14:00',
  endTime: '18:00',
  description: 'Uma breve descrição do evento que será impresso no papel térmico.',
  predefinedEvent: 'outro',
  brand: 'ri_happy',
  isActive: true,
  timeFormat: 'range',
};

const formatWhatsapp = (value: string) => {
  let v = value.replace(/\D/g, '');
  v = v.substring(0, 11);
  if (v.length === 0) return '';
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
};

export default function Home() {
  const { toast } = useToast();
  const [storeCode, setStoreCode] = useState('');
  const [customStore, setCustomStore] = useState('');
  const [brand, setBrand] = useState<Brand | ''>('');
  const [whatsapp, setWhatsapp] = useState('');
  const [events, setEvents] = useState<EventData[]>([initialEvent]);
  const [isSameThemeAllMonth, setIsSameThemeAllMonth] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("exchange_seal");
  const [exchangeOrigin, setExchangeOrigin] = useState<ExchangeOrigin>('ADD PICKUP');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const derivedStoreCode = useMemo(() => {
    if (storeCode === 'OUTRA') {
      const match = customStore.match(/^(\d{4})/);
      return match ? match[1] : customStore.trim();
    }
    return storeCode;
  }, [storeCode, customStore]);

  const storeName = useMemo(() => {
    return derivedStoreCode ? `LOJA ${derivedStoreCode}` : '';
  }, [derivedStoreCode]);

  const isPrintEnabled = useMemo(() => {
    const hasStore = storeCode === 'OUTRA' ? !!customStore.trim() : !!storeCode;
    if (viewMode === 'events') {
      return hasStore && !!brand;
    }
    return hasStore;
  }, [storeCode, customStore, viewMode, brand]);

  const handlePrintDirect = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const { toJpeg } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('capture-target');
      if (!element) return;

      const imgData = await toJpeg(element, {
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 4,
        fontEmbedCSS: '',
      });

      let pdf;
      if (viewMode === 'exchange_seal') {
        pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [102, 48]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, 102, 48);
        pdf.save('selo_troca.pdf');
      } else {
        const mmWidth = 80;
        const rect = element.getBoundingClientRect();
        const mmHeight = (rect.height * mmWidth) / rect.width;
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [mmWidth, mmHeight]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, mmWidth, mmHeight);
        pdf.save('etiqueta.pdf');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Ocorreu um erro ao processar o documento. Você também pode usar o botão Imprimir.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    try {
      const savedStore = localStorage.getItem(LOCAL_STORAGE_KEY_STORE);
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        if (parsed) {
          setStoreCode(parsed);
          if (parsed !== 'OUTRA') {
            setBrand(getBrandFromStoreCode(parsed));
          }
        }
      }

      const savedCustomStore = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_STORE);
      if (savedCustomStore) {
        setCustomStore(JSON.parse(savedCustomStore));
      }

      const savedBrand = localStorage.getItem(LOCAL_STORAGE_KEY_BRAND);
      if (savedBrand) setBrand(JSON.parse(savedBrand));

      const savedWhatsapp = localStorage.getItem(LOCAL_STORAGE_KEY_WHATSAPP);
      if (savedWhatsapp) setWhatsapp(JSON.parse(savedWhatsapp));

      const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        if (parsedEvents && parsedEvents.length > 0) {
          setEvents(parsedEvents);
        }
      }
    } catch (error) {
      console.error("Falha ao carregar dados do localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STORE, JSON.stringify(storeCode));
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_STORE, JSON.stringify(customStore));
    localStorage.setItem(LOCAL_STORAGE_KEY_BRAND, JSON.stringify(brand));
    localStorage.setItem(LOCAL_STORAGE_KEY_WHATSAPP, JSON.stringify(whatsapp));
    localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [storeCode, customStore, brand, whatsapp, events]);

  useEffect(() => {
    document.body.classList.remove('print-events', 'print-discount', 'print-exchange_seal', 'print-survey_invite');
    document.body.classList.add(`print-${viewMode}`);
  }, [viewMode]);

  const showSameThemeSwitch = useMemo(() => {
    return events.some(event => event.predefinedEvent === 'happy_sabado');
  }, [events]);

  const firstHappySabadoId = useMemo(() => {
    return events.find(e => e.predefinedEvent === 'happy_sabado')?.id;
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
      const themeTitle = `Happy Sábado - ${firstHappySabado.subtitle || ''}`;
      const themeDescription = `Todo sábado de ${monthOfEvents} é dia de festa na loja!\n${firstHappySabado.description || ''}`;

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
        if (a.id === 'unified_happy_sabado') return 1;
        if (b.id === 'unified_happy_sabado') return -1;
        const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
        return dateA.getTime() - dateB.getTime();
      });
    } else {
      return sortedEvents.map((event: EventData) => ({
        ...event,
        title: event.predefinedEvent === "happy_sabado" ? `Happy Sábado - ${event.subtitle || ''}` : event.title,
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
        title: '',
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
    <main className="flex min-h-screen w-full flex-col items-center bg-zinc-50/50 font-sans">
      <div className="w-full max-w-[1600px] mx-auto pt-8 pb-6 px-4 sm:px-6 flex flex-col">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,460px] gap-6 xl:gap-8 items-start">

          {/* LEFT COLUMN — Formulários + navegação */}
          <div className="no-print w-full flex flex-col gap-4 lg:pr-2">

            {/* Navigation tabs */}
            <div className="no-print grid grid-cols-3 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl w-full gap-1.5 border border-zinc-200/60 shadow-sm relative z-50">
              <button
                onClick={() => setViewMode('exchange_seal')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'exchange_seal'
                    ? 'bg-zinc-900 shadow text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Info className="h-4 w-4 shrink-0" />
                <span>Selo Troca</span>
              </button>
              <button
                onClick={() => setViewMode('events')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'events'
                    ? 'bg-zinc-900 shadow text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>Eventos</span>
              </button>
              <button
                onClick={() => setViewMode('discount')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'discount'
                    ? 'bg-zinc-900 shadow text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <TicketPercent className="h-4 w-4 shrink-0" />
                <span>Cupom 10%</span>
              </button>
            </div>

            {/* Store info card */}
            <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl transition-all hover:bg-white/80 rounded-2xl">
              <CardHeader className="border-b border-zinc-100 pb-4 pt-5 px-5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-800">
                  Identificação da Loja
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs">Selecione o número da filial.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 px-5 pb-5">
                <div className={`grid grid-cols-1 gap-3 ${viewMode === 'events' ? 'sm:grid-cols-[2fr,1fr]' : 'sm:grid-cols-1'}`}>
                  <div className="space-y-1.5">
                    <Label htmlFor="storeCode" className="text-zinc-700 font-semibold text-xs">Número da Loja</Label>
                    <Select
                      value={storeCode}
                      onValueChange={(val) => {
                        setStoreCode(val);
                        if (val !== 'OUTRA') {
                          setBrand(getBrandFromStoreCode(val));
                        }
                      }}
                    >
                      <SelectTrigger className="h-10 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098]">
                        <SelectValue placeholder="Selecione o número da loja" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {STORE_CODES.map((code) => (
                          <SelectItem key={code} value={code}>
                            Loja {code}
                          </SelectItem>
                        ))}
                        <SelectItem value="OUTRA">OUTRA (Digitar número)</SelectItem>
                      </SelectContent>
                    </Select>
                    {storeCode === 'OUTRA' && (
                      <Input
                        value={customStore}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setCustomStore(val);
                          if (val) {
                            setBrand(getBrandFromStoreCode(val));
                          }
                        }}
                        placeholder="Ex: 1187"
                        className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-10 mt-1.5"
                      />
                    )}
                  </div>

                  {viewMode === 'events' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="brand" className="text-zinc-700 font-semibold text-xs">Rede</Label>
                      <Select
                        value={brand}
                        onValueChange={(value) => setBrand(value as Brand)}
                        disabled={!derivedStoreCode}
                      >
                        <SelectTrigger className="h-10 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] disabled:opacity-50">
                          <SelectValue placeholder="Selecione a Rede" />
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
                  )}
                </div>

                {viewMode === 'events' && (
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp" className="text-zinc-700 font-semibold text-xs">WhatsApp da Loja</Label>
                      <Input
                        id="whatsapp"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                        placeholder="(21) 99999-8888"
                        className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-10"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {viewMode === 'events' && (
              <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl rounded-2xl">
                <CardHeader className="border-b border-zinc-100 pb-4 pt-5 px-5">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-800">
                    Gerenciar Eventos
                  </CardTitle>
                  <CardDescription className="text-zinc-500 text-xs">Adicione até {MAX_EVENTS} eventos. Apenas os ativos serão impressos.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 px-5 pb-5">
                  {showSameThemeSwitch && (
                    <div className="flex items-center space-x-2 py-3 mb-4 bg-yellow-50 border border-yellow-100 px-4 rounded-xl">
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

                  <Accordion type="multiple" className="w-full space-y-3">
                    {events.map((eventData) => (
                      <AccordionItem value={eventData.id!} key={eventData.id} className="border-none">
                        <div className={`border rounded-2xl transition-all shadow-sm ${eventData.isActive ? 'border-zinc-200 bg-white' : 'border-dashed border-zinc-200 bg-zinc-50/50 opacity-70'}`}>
                          <AccordionTrigger className="px-5 py-3.5 hover:no-underline rounded-2xl">
                            <div className="flex-1 text-left flex items-center gap-4">
                              <div className={`h-2 w-2 rounded-full ${eventData.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-300'}`} />
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
                                isSameThemeAllMonth={isSameThemeAllMonth && eventData.predefinedEvent === 'happy_sabado' && eventData.id !== firstHappySabadoId}
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
                      className="w-full mt-4 py-5 border-dashed border-2 bg-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300 transition-all rounded-2xl"
                      variant="outline"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span className="text-sm font-semibold">Adicionar Novo Evento</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {viewMode === 'discount' && (
              <Card className="shadow-sm border-none ring-1 ring-gray-200 bg-[#E10098]/5">
                <CardContent className="pt-4 px-5 pb-5">
                  <div className="bg-[#E10098]/5 rounded-2xl p-5 border border-[#E10098]/10 text-[#E10098]">
                    <p className="font-bold flex items-center gap-2 mb-3">
                      <TicketPercent className="h-5 w-5" />
                      Boas Práticas
                    </p>
                    <ul className="space-y-2.5 text-sm font-medium leading-tight list-disc pl-5">
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
                <CardHeader className="border-b border-zinc-100 pb-4 pt-5 px-5">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-800">
                    Configurar Selo Troca
                  </CardTitle>
                  <CardDescription className="text-zinc-500 text-xs">Selecione a origem da troca.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 px-5 pb-5">
                  <div className="space-y-2">
                    <Label className="text-zinc-700 font-semibold text-xs">Origem</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['ADD PICKUP', 'Site', 'DLVR', 'CEHF'] as const).map((origin) => {
                        const isPbKids = getBrandFromStoreCode(derivedStoreCode) === 'pb_kids';
                        const labels: Record<ExchangeOrigin, string> = {
                          'ADD PICKUP': 'Adicional Pickup',
                          'Site': 'Site',
                          'DLVR': 'Delivery',
                          'CEHF': isPbKids ? 'Campanha Esquenta Best Friday' : 'Campanha Esquenta Happy Friday',
                        };
                        return (
                          <button
                            key={origin}
                            onClick={() => setExchangeOrigin(origin)}
                            className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                              exchangeOrigin === origin
                                ? 'border-[#E10098] bg-[#E10098]/10 text-[#E10098]'
                                : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                            }`}
                          >
                            {labels[origin]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN — Preview + Ações de Impressão */}
          <div className="flex flex-col items-center justify-start gap-4 w-full pb-4">
            <div id="print-container" className="w-full overflow-x-auto no-scrollbar origin-top scale-[0.85] sm:scale-100 flex justify-center shrink-0 py-2 relative">
              {viewMode === 'exchange_seal' && (
                <style>{`
                  @media print {
                    @page {
                      size: 102mm 48mm !important;
                      margin: 0 !important;
                    }
                    #print-container {
                      width: 102mm !important;
                      height: 48mm !important;
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
              {!isPrintEnabled && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center no-print">
                  <div className="h-14 w-14 bg-[#E10098]/10 rounded-full flex items-center justify-center mb-3">
                    <Info className="h-7 w-7 text-[#E10098]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Atenção!</h3>
                  <p className="text-sm text-zinc-500">Por favor, selecione o <b>número da loja</b> para habilitar a impressão.</p>
                </div>
              )}
              <div id="capture-target" className="shrink-0 bg-white">
                {viewMode === 'events' ? (
                  <PrintContainer
                    storeName={storeName}
                    events={enhancedEvents}
                    whatsapp={whatsapp}
                    brand={brand || 'ri_happy'}
                  />
                ) : viewMode === 'discount' ? (
                  <DiscountCoupon storeName={storeName} brand={brand || 'ri_happy'} />
                ) : viewMode === 'survey_invite' ? (
                  <SurveyInviteCoupon
                    storeCode={derivedStoreCode}
                    storeName={storeName}
                    brand={brand || 'ri_happy'}
                  />
                ) : (
                  <ExchangeSeal origin={exchangeOrigin} storeCode={derivedStoreCode} />
                )}
              </div>
            </div>

            <div className="no-print w-full flex flex-col sm:flex-row gap-3">
              {viewMode !== 'exchange_seal' && (
                <Button
                  onClick={handlePrintDirect}
                  disabled={!isPrintEnabled}
                  className={`flex-1 py-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                    isPrintEnabled
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                  size="lg"
                >
                  <Printer className="mr-2.5 h-5 w-5" />
                  <span className="text-base font-semibold">Imprimir na Térmica</span>
                </Button>
              )}

              <Button
                onClick={handleGeneratePDF}
                disabled={!isPrintEnabled || isGeneratingPdf}
                variant={viewMode === 'exchange_seal' ? 'default' : 'outline'}
                className={`w-full ${viewMode !== 'exchange_seal' ? 'flex-1' : ''} py-6 rounded-2xl transition-all active:scale-[0.98] ${
                  viewMode === 'exchange_seal'
                    ? isPrintEnabled && !isGeneratingPdf
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : isPrintEnabled && !isGeneratingPdf
                      ? 'border-2 border-zinc-300 hover:bg-zinc-100 text-zinc-800'
                      : 'border-2 border-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
                size="lg"
              >
                <Download className={`mr-2.5 h-5 w-5 ${isGeneratingPdf ? 'animate-pulse' : ''}`} />
                <span className="text-base font-semibold">
                  {isGeneratingPdf ? 'Gerando...' : (viewMode === 'exchange_seal' ? 'Baixar Selo' : 'Baixar PDF')}
                </span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}