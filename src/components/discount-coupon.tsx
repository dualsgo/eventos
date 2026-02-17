"use client";

import { Card } from '@/components/ui/card';
import { Gift, Sun } from 'lucide-react';

interface DiscountCouponProps {
  storeName: string;
}

const RECEIPT_WIDTH_PX = 302;

export function DiscountCoupon({ storeName }: DiscountCouponProps) {
  const separator = "----------------------------------------";

  return (
    <Card
      className="receipt p-0 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px` }}
    >
      {/* Topo Institucional - Magenta */}
      <div className="bg-[#E10098] text-white py-3 px-2 flex items-center justify-center gap-2">
        <Sun className="fill-yellow-400 text-yellow-400 h-8 w-8" />
        <h1 className="font-bold text-sm leading-tight uppercase tracking-tight">
          RETIRE NA LOJA E GANHE!
        </h1>
      </div>

      <div className="p-3">
        <div className="text-center mb-2">
          <h2 className="font-bold text-xs break-words uppercase text-gray-600">RI HAPPY - {storeName || 'SUA LOJA'}</h2>
        </div>

        <p className="text-xs my-1 text-center opacity-30">{separator}</p>
        
        {/* Selo de Destaque Amarelo */}
        <div className="bg-yellow-400 rounded-2xl py-4 my-4 border-4 border-white shadow-sm flex flex-col items-center justify-center">
            <p className="font-bold text-8xl leading-none tracking-tighter">10%</p>
            <p className="font-bold text-2xl -mt-1 uppercase">DE DESCONTO</p>
        </div>

        <p className="text-xs my-1 text-center opacity-30">{separator}</p>
        
        <div className="bg-[#00B5E2] text-white rounded-lg p-2 my-3">
          <p className="text-xs font-bold uppercase leading-tight">
            Válido para a compra de qualquer produto na loja na data da retirada do seu pedido!
          </p>
        </div>
        
        <p className="text-xs my-1 mt-4 text-center opacity-30">{separator}</p>
        
        <div className="text-left text-[10px] mt-2 px-1 border-2 border-dashed border-gray-300 p-2 rounded-md">
          <p className="font-bold text-center mb-1 text-xs underline">CONTROLE INTERNO DA LOJA</p>
          <div className="flex justify-between mt-2">
            <p>PEDIDO Nº: _________________</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>DATA: ____/____/____</p>
            <p>ADICIONAL: ( ) S ( ) N</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center">
            <Gift className="h-6 w-6 text-pink-600 mb-1" />
            <p className="text-[10px] font-bold uppercase">Aproveite para completar a brincadeira!</p>
        </div>
      </div>

      <div 
        className="torn-effect absolute bottom-0 left-0 right-0 h-3 bg-repeat-x"
        style={{
            backgroundImage: `radial-gradient(circle at 50% 0, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 100%, #ffffff 0px, #ffffff 1.5px, transparent 1.5px)`,
            backgroundSize: `6px 3px`,
            backgroundPosition: '0 -1.5px, 0 100%',
        }}
      />
    </Card>
  );
}