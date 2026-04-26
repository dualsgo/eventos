"use client";

import { Card } from '@/components/ui/card';

interface ExchangeSealProps {
  origin: 'ADD PICKUP' | 'Site';
  storeCode: string;
}

export function ExchangeSeal({ origin, storeCode }: ExchangeSealProps) {
  const today = new Date().toLocaleDateString('pt-BR');

  const Label = () => (
    <div className="flex flex-col bg-white text-black text-center overflow-hidden border-r border-dashed border-gray-200 last:border-r-0 print:border-none" 
         style={{ width: '34mm', height: '48mm', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 5mm - Logo (Reservado) */}
      <div style={{ height: '5mm' }} />

      {/* 20mm - Loja e Selo Troca */}
      <div className="flex flex-col items-start justify-center pl-2" style={{ height: '20mm' }}>
        <p className="text-lg leading-tight">
          Loja: {storeCode}
        </p>
        <h1 className="uppercase text-lg tracking-tighter leading-none mt-2">
          SELO TROCA
        </h1>
      </div>

      {/* 8mm - Origem (Tarja Preta) */}
      <div className="flex items-center justify-center bg-black text-white" style={{ height: '8mm', backgroundColor: 'black', color: 'white', WebkitPrintColorAdjust: 'exact' }}>
        <span className="text-sm font-bold uppercase tracking-widest leading-none">
          {origin}
        </span>
      </div>

      {/* 5mm - Espaço que era da Política (Vazio agora) */}
      <div style={{ height: '5mm' }} />

      {/* 10mm - Data (Começa em 14mm da esquerda e 3mm do fundo) */}
      <div className="relative w-full" style={{ height: '10mm' }}>
        <p className="absolute text-xs leading-none" style={{ left: '14mm', bottom: '3mm' }}>
          {today}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex bg-white shadow-xl print:shadow-none" style={{ width: '102mm', height: '48mm' }}>
      <Label />
      <Label />
      <Label />
    </div>
  );
}
