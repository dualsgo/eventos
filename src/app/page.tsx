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
import { ToolsMenu } from '@/components/tools-menu';

const MAX_EVENTS = 4;
const LOCAL_STORAGE_KEY_STORE = "eventPrinter.storeName";
const LOCAL_STORAGE_KEY_BRAND = "eventPrinter.brand";
const LOCAL_STORAGE_KEY_WHATSAPP = "eventPrinter.whatsapp";
const LOCAL_STORAGE_KEY_INSTAGRAM = "eventPrinter.instagram";
const LOCAL_STORAGE_KEY_EVENTS = "eventPrinter.events";

type ViewMode = 'events' | 'discount' | 'exchange_seal' | 'survey_invite';

export type Brand = 'ri_happy' | 'pb_kids';

const BRAND_LABELS: Record<Brand, string> = {
  ri_happy: 'Ri Happy',
  pb_kids: 'PB Kids',
};

const STORES = [
  { code: "1054", name: "CAMPO GRANDE", regional: "CO1 - TAISE" },
  { code: "1071", name: "BURITI", regional: "CO1 - TAISE" },
  { code: "1085", name: "PANTANAL", regional: "CO1 - TAISE" },
  { code: "1088", name: "BRASIL PARK SHOP", regional: "CO1 - TAISE" },
  { code: "1095", name: "CAPIM DOURADO", regional: "CO1 - TAISE" },
  { code: "1102", name: "NORTE SUL", regional: "CO1 - TAISE" },
  { code: "1114", name: "AVENIDA CENTER DOURADOS", regional: "CO1 - TAISE" },
  { code: "1129", name: "GOIÂNIA SHOPPING", regional: "CO1 - TAISE" },
  { code: "1196", name: "ESTAÇÃO CUIABÁ", regional: "CO1 - TAISE" },
  { code: "1202", name: "SHOPPING CERRADO", regional: "CO1 - TAISE" },
  { code: "1241", name: "SHOPPING FLAMBOYANT", regional: "CO1 - TAISE" },
  { code: "1015", name: "INDEPENDÊNCIA", regional: "MG1 - THAINA MARQUES" },
  { code: "1025", name: "UBERLÂNDIA", regional: "MG1 - THAINA MARQUES" },
  { code: "1032", name: "DEL REY", regional: "MG1 - THAINA MARQUES" },
  { code: "1050", name: "SAVASSI", regional: "MG1 - THAINA MARQUES" },
  { code: "1069", name: "ITAUPOWER", regional: "MG1 - THAINA MARQUES" },
  { code: "1086", name: "MINAS SHOPPING", regional: "MG1 - THAINA MARQUES" },
  { code: "1100", name: "BOULEVARD BH", regional: "MG1 - THAINA MARQUES" },
  { code: "1110", name: "ESTAÇÃO BH", regional: "MG1 - THAINA MARQUES" },
  { code: "1113", name: "BOULEVARD CAMPOS", regional: "MG1 - THAINA MARQUES" },
  { code: "1133", name: "SHOP METROPOLITAN GARDEN", regional: "MG1 - THAINA MARQUES" },
  { code: "1163", name: "JARDIM NORTE", regional: "MG1 - THAINA MARQUES" },
  { code: "1238", name: "BH SHOPPING", regional: "MG1 - THAINA MARQUES" },
  { code: "9012", name: "DIAMOND", regional: "MG1 - THAINA MARQUES" },
  { code: "9024", name: "UBERLÂNDIA", regional: "MG1 - THAINA MARQUES" },
  { code: "9026", name: "BH SHOPPING", regional: "MG1 - THAINA MARQUES" },
  { code: "9089", name: "SHOPPING UBERLÂNDIA", regional: "MG1 - THAINA MARQUES" },
  { code: "1065", name: "IGUATEMI FORTALEZA", regional: "NE1 - JUCILENE" },
  { code: "1068", name: "NORTH SHOPPING", regional: "NE1 - JUCILENE" },
  { code: "1075", name: "MIDWAY MALL", regional: "NE1 - JUCILENE" },
  { code: "1147", name: "MOSSORÓ WEST SHOPPING", regional: "NE1 - JUCILENE" },
  { code: "1152", name: "NORTH SHOPPING JOQUEI", regional: "NE1 - JUCILENE" },
  { code: "1154", name: "SHOPP PARANGABA", regional: "NE1 - JUCILENE" },
  { code: "1173", name: "RIOMAR FORTALEZA", regional: "NE1 - JUCILENE" },
  { code: "1206", name: "SHOPPING VIA SUL", regional: "NE1 - JUCILENE" },
  { code: "1207", name: "PÁTIO DOM LUIS", regional: "NE1 - JUCILENE" },
  { code: "1208", name: "SHOPPING BENFICA", regional: "NE1 - JUCILENE" },
  { code: "9082", name: "SHOPPING DEL PASEO", regional: "NE1 - JUCILENE" },
  { code: "9084", name: "SHOPPING IGUATEMI FORTALEZA", regional: "NE1 - JUCILENE" },
  { code: "9087", name: "SHOPPING RIOMAR FORTALEZA", regional: "NE1 - JUCILENE" },
  { code: "9088", name: "RIOMAR KENNEDY", regional: "NE1 - JUCILENE" },
  { code: "1061", name: "GUARARAPES", regional: "NE2 - CAIO" },
  { code: "1062", name: "MANAÍRA", regional: "NE2 - CAIO" },
  { code: "1070", name: "CENTER RECIFE", regional: "NE2 - CAIO" },
  { code: "1105", name: "SHOPPING DA ILHA", regional: "NE2 - CAIO" },
  { code: "1118", name: "RIOMAR RECIFE", regional: "NE2 - CAIO" },
  { code: "1131", name: "NORTH SHOP CARUARU", regional: "NE2 - CAIO" },
  { code: "1137", name: "SHOPPING RIO ANIL", regional: "NE2 - CAIO" },
  { code: "1142", name: "SHOPPING SÃO LUÍS", regional: "NE2 - CAIO" },
  { code: "1158", name: "MANGABEIRA SHOPPING", regional: "NE2 - CAIO" },
  { code: "1167", name: "TERESINA SHOPPING", regional: "NE2 - CAIO" },
  { code: "1193", name: "SHOPPING RIO POTY", regional: "NE2 - CAIO" },
  { code: "1282", name: "TACARUNA", regional: "NE2 - CAIO" },
  { code: "1341", name: "SHOPPING BOA VISTA (POP UP)", regional: "NE2 - CAIO" },
  { code: "9035", name: "CASA FORTE", regional: "NE2 - CAIO" },
  { code: "9083", name: "SHOPPING RECIFE", regional: "NE2 - CAIO" },
  { code: "9086", name: "SHOPPING RIOMAR RECIFE", regional: "NE2 - CAIO" },
  { code: "1082", name: "SALVADOR", regional: "NE3 - TBD" },
  { code: "1089", name: "PRAIA DA COSTA", regional: "NE3 - TBD" },
  { code: "1093", name: "PÁTIO MACEIÓ", regional: "NE3 - TBD" },
  { code: "1104", name: "MESTRE ÁLVARO", regional: "NE3 - TBD" },
  { code: "1116", name: "BOULEVARD VILA VELHA", regional: "NE3 - TBD" },
  { code: "1134", name: "PARQUE SHOPPING MACEIÓ", regional: "NE3 - TBD" },
  { code: "1139", name: "PATIO ARAPIRACA GARDEN", regional: "NE3 - TBD" },
  { code: "1204", name: "SHOPPING DA BAHIA", regional: "NE3 - TBD" },
  { code: "1205", name: "SHOPPING CENTER JARDINS - ARACAJÚ", regional: "NE3 - TBD" },
  { code: "1214", name: "SHOPPING VILA VELHA", regional: "NE3 - TBD" },
  { code: "1250", name: "PARQUE SHOPPING BAHIA", regional: "NE3 - TBD" },
  { code: "1290", name: "MACEIÓ SHOPPING", regional: "NE3 - TBD" },
  { code: "1302", name: "SALVADOR NORTE", regional: "NE3 - TBD" },
  { code: "9021", name: "BARRA SALVADOR", regional: "NE3 - TBD" },
  { code: "9031", name: "ARACAJU", regional: "NE3 - TBD" },
  { code: "9044", name: "PARALELA", regional: "NE3 - TBD" },
  { code: "9061", name: "BELA VISTA", regional: "NE3 - TBD" },
  { code: "1037", name: "BRASÍLIA", regional: "NO1 - EDUARDO" },
  { code: "1043", name: "CONJUNTO NACIONAL", regional: "NO1 - EDUARDO" },
  { code: "1067", name: "TAGUATINGA", regional: "NO1 - EDUARDO" },
  { code: "1094", name: "BOULEVARD BRASILIA", regional: "NO1 - EDUARDO" },
  { code: "1115", name: "PARQUE BELÉM", regional: "NO1 - EDUARDO" },
  { code: "1119", name: "BOULEVARD BELÉM", regional: "NO1 - EDUARDO" },
  { code: "1209", name: "SHOPPING BOSQUE GRÃO PARÁ", regional: "NO1 - EDUARDO" },
  { code: "1215", name: "SUMAÚMA PARK SHOPPING", regional: "NO1 - EDUARDO" },
  { code: "1216", name: "BRASILIA SHOPPING", regional: "NO1 - EDUARDO" },
  { code: "1340", name: "MANAUS PLAZA SHOPPING (POP UP)", regional: "NO1 - EDUARDO" },
  { code: "9064", name: "SHOPPING AMAZONAS", regional: "NO1 - EDUARDO" },
  { code: "9078", name: "MANAUARA SHOPPING", regional: "NO1 - EDUARDO" },
  { code: "1030", name: "NOVA AMÉRICA", regional: "RJ1 - DANIELE" },
  { code: "1033", name: "NORTESHOPPING", regional: "RJ1 - DANIELE" },
  { code: "1052", name: "BANGU", regional: "RJ1 - DANIELE" },
  { code: "1057", name: "IGUATEMI RJ", regional: "RJ1 - DANIELE" },
  { code: "1058", name: "VIA PARQUE", regional: "RJ1 - DANIELE" },
  { code: "1072", name: "GRANDE RIO", regional: "RJ1 - DANIELE" },
  { code: "1078", name: "ILHA PLAZA", regional: "RJ1 - DANIELE" },
  { code: "1101", name: "PARTEGE SÃO GONÇALO", regional: "RJ1 - DANIELE" },
  { code: "1106", name: "SHOPPING METROPOLITANO BARRA", regional: "RJ1 - DANIELE" },
  { code: "1141", name: "AMÉRICA SHOPPING", regional: "RJ1 - DANIELE" },
  { code: "1169", name: "NOVA IGUAÇU", regional: "RJ1 - DANIELE" },
  { code: "1187", name: "CARIOCA SHOPPING", regional: "RJ1 - DANIELE" },
  { code: "1224", name: "TOP SHOPPING", regional: "RJ1 - DANIELE" },
  { code: "1232", name: "BARRA SHOPPING", regional: "RJ1 - DANIELE" },
  { code: "1239", name: "SHOPPING RECREIO", regional: "RJ1 - DANIELE" },
  { code: "1300", name: "ECO VILLA", regional: "RJ1 - DANIELE" },
  { code: "1301", name: "IPANEMA", regional: "RJ1 - DANIELE" },
  { code: "1304", name: "PARK JACAREPAGUÁ", regional: "RJ1 - DANIELE" },
  { code: "1335", name: "PLAZA NITERÓI", regional: "RJ1 - DANIELE" },
  { code: "1337", name: "PARQUE CAMPO GRANDE", regional: "RJ1 - DANIELE" },
  { code: "9014", name: "RIO DESIGN", regional: "RJ1 - DANIELE" },
  { code: "9094", name: "BARRA SHOPPING", regional: "RJ1 - DANIELE" },
  { code: "1011", name: "MIRUNA", regional: "SP1 - SAMUEL" },
  { code: "1021", name: "MORUMBI TOWN", regional: "SP1 - SAMUEL" },
  { code: "1027", name: "SP MARKET", regional: "SP1 - SAMUEL" },
  { code: "1042", name: "HIGIENÓPOLIS", regional: "SP1 - SAMUEL" },
  { code: "1044", name: "IGUATEMI SÃO PAULO", regional: "SP1 - SAMUEL" },
  { code: "1045", name: "VILLA LOBOS", regional: "SP1 - SAMUEL" },
  { code: "1048", name: "INTERLAGOS", regional: "SP1 - SAMUEL" },
  { code: "1191", name: "CIDADE SÃO PAULO", regional: "SP1 - SAMUEL" },
  { code: "1303", name: "BOURBON SP", regional: "SP1 - SAMUEL" },
  { code: "1343", name: "WEST PLAZA  (POP UP)", regional: "SP1 - SAMUEL" },
  { code: "1349", name: "SHOPPING MORUMBI", regional: "SP1 - SAMUEL" },
  { code: "9001", name: "REBOUÇAS", regional: "SP1 - SAMUEL" },
  { code: "9005", name: "CIDADE JARDIM", regional: "SP1 - SAMUEL" },
  { code: "9006", name: "ELDORADO", regional: "SP1 - SAMUEL" },
  { code: "9016", name: "JARDIM SUL", regional: "SP1 - SAMUEL" },
  { code: "9025", name: "MORUMBI", regional: "SP1 - SAMUEL" },
  { code: "9060", name: "JK", regional: "SP1 - SAMUEL" },
  { code: "9092", name: "SHOPPING IBIRAPUERA", regional: "SP1 - SAMUEL" },
  { code: "1023", name: "COLINAS", regional: "SP2 - TARCIO" },
  { code: "1026", name: "MOGI", regional: "SP2 - TARCIO" },
  { code: "1035", name: "GUARULHOS", regional: "SP2 - TARCIO" },
  { code: "1038", name: "SHOPPING PENHA", regional: "SP2 - TARCIO" },
  { code: "1049", name: "VALE SUL", regional: "SP2 - TARCIO" },
  { code: "1051", name: "ARICANDUVA", regional: "SP2 - TARCIO" },
  { code: "1063", name: "METRÔ TATUAPÉ", regional: "SP2 - TARCIO" },
  { code: "1090", name: "UNIÃO DE OSASCO", regional: "SP2 - TARCIO" },
  { code: "1140", name: "TIETÊ PLAZA SHOPPING", regional: "SP2 - TARCIO" },
  { code: "1172", name: "METRÔ ITAQUERA", regional: "SP2 - TARCIO" },
  { code: "1177", name: "DOMINGOS DE MORAES", regional: "SP2 - TARCIO" },
  { code: "1200", name: "OTTO BAUMGART", regional: "SP2 - TARCIO" },
  { code: "1281", name: "METRÔ TUCURUVI", regional: "SP2 - TARCIO" },
  { code: "1338", name: "OSASCO PLAZA (POP UP)", regional: "SP2 - TARCIO" },
  { code: "9011", name: "CENTER VALE", regional: "SP2 - TARCIO" },
  { code: "9023", name: "ANÁLIA FRANCO", regional: "SP2 - TARCIO" },
  { code: "9040", name: "SANTANA", regional: "SP2 - TARCIO" },
  { code: "9058", name: "MOOCA", regional: "SP2 - TARCIO" },
  { code: "9076", name: "PARQUE SHOPPING MAIA", regional: "SP2 - TARCIO" },
  { code: "9093", name: "METRÔ TATUAPÉ - TUDO BLOCOS", regional: "SP2 - TARCIO" },
  { code: "1002", name: "JOÃO CACHOEIRA", regional: "SP3 - THAINA PRESTES" },
  { code: "1004", name: "AUGUSTA", regional: "SP3 - THAINA PRESTES" },
  { code: "1017", name: "GRAN PLAZA", regional: "SP3 - THAINA PRESTES" },
  { code: "1031", name: "ESPLANADA SHOPPING CENTER", regional: "SP3 - THAINA PRESTES" },
  { code: "1041", name: "RAPOSO", regional: "SP3 - THAINA PRESTES" },
  { code: "1046", name: "LITORAL PLAZA", regional: "SP3 - THAINA PRESTES" },
  { code: "1055", name: "PRAIAMAR", regional: "SP3 - THAINA PRESTES" },
  { code: "1060", name: "MAUÁ", regional: "SP3 - THAINA PRESTES" },
  { code: "1066", name: "MAXI SHOPPING", regional: "SP3 - THAINA PRESTES" },
  { code: "1087", name: "LA PLAGE", regional: "SP3 - THAINA PRESTES" },
  { code: "1091", name: "PRAÇA DA MOÇA", regional: "SP3 - THAINA PRESTES" },
  { code: "1098", name: "BRISAMAR", regional: "SP3 - THAINA PRESTES" },
  { code: "1121", name: "SÃO BERNARDO PLAZA", regional: "SP3 - THAINA PRESTES" },
  { code: "1130", name: "ATRIUM SANTO ANDRÉ", regional: "SP3 - THAINA PRESTES" },
  { code: "1244", name: "ANA COSTA", regional: "SP3 - THAINA PRESTES" },
  { code: "1342", name: "MIRAMAR (POP UP)", regional: "SP3 - THAINA PRESTES" },
  { code: "9029", name: "TAMBORÉ", regional: "SP3 - THAINA PRESTES" },
  { code: "9054", name: "GRANJA VIANA", regional: "SP3 - THAINA PRESTES" },
  { code: "9055", name: "ALPHAVILLE", regional: "SP3 - THAINA PRESTES" },
  { code: "9073", name: "GOLDEN SQUARE SÃO BERNARDO", regional: "SP3 - THAINA PRESTES" },
  { code: "9075", name: "IGUATEMI ESPLANADA", regional: "SP3 - THAINA PRESTES" },
  { code: "9090", name: "FAZENDA BOA VISTA", regional: "SP3 - THAINA PRESTES" },
  { code: "1008", name: "PIRACICABA", regional: "SP4 - RODRIGO" },
  { code: "1009", name: "PLAZA AVENIDA", regional: "SP4 - RODRIGO" },
  { code: "1010", name: "NOVO SHOPPING", regional: "SP4 - RODRIGO" },
  { code: "1012", name: "RIBEIRÃO SHOPPING", regional: "SP4 - RODRIGO" },
  { code: "1013", name: "RIO PRETO", regional: "SP4 - RODRIGO" },
  { code: "1016", name: "PRESIDENTE PRUDENTE", regional: "SP4 - RODRIGO" },
  { code: "1018", name: "RIO CLARO", regional: "SP4 - RODRIGO" },
  { code: "1020", name: "CAMPINAS SHOPPING", regional: "SP4 - RODRIGO" },
  { code: "1024", name: "LIMEIRA", regional: "SP4 - RODRIGO" },
  { code: "1028", name: "SÃO CARLOS", regional: "SP4 - RODRIGO" },
  { code: "1047", name: "BAURU", regional: "SP4 - RODRIGO" },
  { code: "1053", name: "MARILIA", regional: "SP4 - RODRIGO" },
  { code: "1064", name: "IGUATEMI CAMPINAS", regional: "SP4 - RODRIGO" },
  { code: "1122", name: "SHOPPING NAÇÕES BAURU", regional: "SP4 - RODRIGO" },
  { code: "1138", name: "SHOPPING SERRA SUL", regional: "SP4 - RODRIGO" },
  { code: "1151", name: "IGUATEMI SÃO JOSÉ DO RIO PRETO", regional: "SP4 - RODRIGO" },
  { code: "1197", name: "PARQUE DAS BANDEIRAS", regional: "SP4 - RODRIGO" },
  { code: "1345", name: "SHOPPING JARAGUÁ ARARAQUARA", regional: "SP4 - RODRIGO" },
  { code: "9027", name: "DOM PEDRO", regional: "SP4 - RODRIGO" },
  { code: "9072", name: "IGUATEMI RIBEIRÃO PRETO", regional: "SP4 - RODRIGO" },
  { code: "1014", name: "CATUAÍ SHOPPING", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1019", name: "AVENIDA CENTER", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1079", name: "FLORIPA", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1080", name: "CATUAI MARINGÁ", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1081", name: "VILLA ROMANA FLORIANÓPOLIS", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1084", name: "PALLADIUM", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1092", name: "CURITIBA", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1096", name: "PRAIA DE BELAS", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1111", name: "NEUMARKT SHOPPING", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1126", name: "CONTINENTE FLORIPA", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1171", name: "BALNEÁRIO CAMBORIÚ SHOPPING", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1176", name: "JOINVILLE GARTEN", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1186", name: "NAÇÕES CRICIÚMA", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1230", name: "BARRA SHOPPING SUL", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1305", name: "BOURBON IPIRANGA", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "1334", name: "BOURBON CARLOS GOMES", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "9007", name: "BARIGUI", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "9009", name: "MUELLER", regional: "SU1 - LUIZ ALEXANDRE" },
  { code: "9071", name: "PÁTIO BATEL SHOPPING", regional: "SU1 - LUIZ ALEXANDRE" }
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
  const [selectedRegional, setSelectedRegional] = useState('TODAS');
  const [storeCode, setStoreCode] = useState('');
  const [customStore, setCustomStore] = useState('');
  
  const regionals = useMemo(() => {
    const regs = new Set(STORES.map(s => s.regional));
    return ['TODAS', ...Array.from(regs)].sort();
  }, []);

  const filteredStores = useMemo(() => {
    if (selectedRegional === 'TODAS') return STORES;
    return STORES.filter(s => s.regional === selectedRegional);
  }, [selectedRegional]);
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

  const isPrintEnabled = useMemo(() => {
    const hasStore = storeCode === 'OUTRA' ? !!customStore : !!storeCode;
    
    if (viewMode === 'exchange_seal') {
      return hasStore && selectedRegional !== 'TODAS' && !!brand;
    }
    
    return hasStore;
  }, [storeCode, customStore, viewMode, selectedRegional, brand]);

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
        const themeDescription = `Todo sábado de ${monthOfEvents} é dia de festa na loja!\n${firstHappySabado.description}`;
        
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
    <main className="flex min-h-screen w-full flex-col items-center bg-zinc-50/50 font-sans">
      {/* Main content area */}
      <div className="w-full max-w-[1600px] mx-auto pt-8 pb-6 px-4 sm:px-6 flex flex-col">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,460px] gap-6 xl:gap-8 items-start">

          {/* LEFT COLUMN — Formulários + navegação */}
          <div className="no-print w-full flex flex-col gap-4 lg:pr-2">

            {/* Navigation tabs — prominent, spanning the left column */}
            <div className="no-print grid grid-cols-2 sm:grid-cols-5 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl w-full gap-1.5 border border-zinc-200/60 shadow-sm relative z-50">
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
              <button
                onClick={() => setViewMode('survey_invite')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'survey_invite'
                    ? 'bg-zinc-900 shadow text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Pesquisa</span>
              </button>
              <ToolsMenu />
            </div>

            {/* Store info card */}
            <Card className="shadow-none border border-zinc-200/60 bg-white/60 backdrop-blur-xl transition-all hover:bg-white/80 rounded-2xl">
              <CardHeader className="border-b border-zinc-100 pb-4 pt-5 px-5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-800">
                  Informações da Loja
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs">Estes dados serão usados no cabeçalho dos cupons.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 px-5 pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,1.5fr,1fr] gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="regional" className="text-zinc-700 font-semibold text-xs">Regional</Label>
                    <Select value={selectedRegional} onValueChange={(val) => { setSelectedRegional(val); setStoreCode(''); }}>
                      <SelectTrigger className="h-10 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098]">
                        <SelectValue placeholder="Regional" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionals.map((reg) => (
                          <SelectItem key={reg} value={reg}>
                            {reg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="storeName" className="text-zinc-700 font-semibold text-xs">Nome da Unidade</Label>
                    <Select value={storeCode} onValueChange={setStoreCode}>
                      <SelectTrigger className="h-10 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098]">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStores.map((store) => (
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
                        className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-10 mt-1.5"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="brand" className="text-zinc-700 font-semibold text-xs">Rede</Label>
                    <Select value={brand} onValueChange={(value) => setBrand(value as Brand)}>
                      <SelectTrigger className="h-10 bg-white/50 border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098]">
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
                {viewMode === 'events' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp" className="text-zinc-700 font-semibold text-xs">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="(21) 99999-8888"
                        className="bg-white/50 border-zinc-200 focus:ring-2 focus:ring-[#E10098]/20 focus:border-[#E10098] transition-all rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="instagram" className="text-zinc-700 font-semibold text-xs">Instagram</Label>
                      <Input
                        id="instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@rihappy"
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
                      className="w-full mt-4 py-5 border-dashed border-2 bg-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300 transition-all rounded-2xl shadow-none"
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

          {/* RIGHT COLUMN — Preview + Print button */}
          <div className="flex flex-col items-center justify-start gap-4 w-full pb-4">
            <div id="print-container" className="w-full overflow-x-auto no-scrollbar origin-top scale-[0.85] sm:scale-100 flex justify-center shrink-0 py-2 relative">
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
                  <div className="h-14 w-14 bg-[#E10098]/10 rounded-full flex items-center justify-center mb-3">
                    <Info className="h-7 w-7 text-[#E10098]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Atenção!</h3>
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
              ) : (
                <ExchangeSeal origin={exchangeOrigin} storeCode={derivedStoreCode} />
              )}
            </div>

            <div className="no-print w-full flex flex-col gap-3">
              <Button
                onClick={() => window.print()}
                disabled={!isPrintEnabled}
                className={`w-full py-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                  isPrintEnabled
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
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