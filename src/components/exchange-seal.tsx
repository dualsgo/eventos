"use client";

import { Card } from '@/components/ui/card';

interface ExchangeSealProps {
  origin: 'Ifood' | 'Rappi' | 'Site';
  storeCode: string;
}

export function ExchangeSeal({ origin, storeCode }: ExchangeSealProps) {
  const today = new Date().toLocaleDateString('pt-BR');

  const Label = () => (
    <div className="flex flex-col bg-white text-black text-center overflow-hidden border-r border-dashed border-gray-200 last:border-r-0 print:border-none" 
         style={{ width: '3.4cm', height: '4.9cm', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 0.5 cm - Logo (Reservado) */}
      <div style={{ height: '0.5cm' }} />

      {/* 2.0 cm - Loja e Selo Troca */}
      <div className="flex flex-col items-start justify-center pl-2" style={{ height: '2.0cm' }}>
        <p className="text-lg leading-tight">
          Loja: {storeCode}
        </p>
        <h1 className="uppercase text-lg tracking-tighter leading-none mt-2">
          SELO TROCA
        </h1>
      </div>

      {/* 0.8 cm - Origem (Tarja Preta) */}
      <div className="flex items-center justify-center bg-black text-white" style={{ height: '0.8cm', backgroundColor: 'black', color: 'white', WebkitPrintColorAdjust: 'exact' }}>
        <span className="text-sm font-bold uppercase tracking-widest leading-none">
          {origin}
        </span>
      </div>

      {/* 0.5 cm - Espaço que era da Política (Vazio agora) */}
      <div style={{ height: '0.5cm' }} />

      {/* 0.5 cm - Data (Começa em 1.4cm da esquerda e 0.3cm do fundo) */}
      <div className="relative w-full" style={{ height: '1.1cm' }}>
        <p className="absolute text-xs leading-none" style={{ left: '1.4cm', bottom: '0.3cm' }}>
          {today}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex bg-white shadow-xl print:shadow-none" style={{ width: '10.2cm', height: '4.9cm' }}>
      <Label />
      <Label />
      <Label />
    </div>
  );
}
