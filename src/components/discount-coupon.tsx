"use client";

import { Card } from '@/components/ui/card';

interface DiscountCouponProps {
  storeName: string;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

export function DiscountCoupon({ storeName }: DiscountCouponProps) {
  const separator = "----------------------------------------";

  return (
    <Card
      className="receipt p-4 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      {/* Header Estilo Fiscal */}
      <div className="text-center mb-2">
        <h1 className="font-bold text-sm uppercase leading-tight">RI HAPPY - {storeName || 'LOJA'}</h1>
        <p className="text-[10px] opacity-70">CUPOM DE DESCONTO EXCLUSIVO</p>
      </div>

      <p className="text-xs my-1 text-center opacity-30">{separator}</p>
      
      <div className="py-4 flex flex-col items-center">
        <h2 className="font-bold text-xl uppercase tracking-widest leading-none mb-2">VOCÊ GANHOU!</h2>
        
        {/* Desconto em Destaque Massivo */}
        <div className="flex flex-col items-center justify-center my-2">
          <span className="font-bold text-[100px] leading-none tracking-tighter">10%</span>
          <span className="font-bold text-3xl -mt-2 tracking-widest uppercase">OFF</span>
        </div>

        {/* Call to Action em Destaque */}
        <div className="border-2 border-black border-dashed p-2 my-3 w-full">
           <p className="font-bold text-xs uppercase leading-tight">Aproveite para completar a brincadeira!</p>
        </div>
        
        <p className="text-[10px] font-bold uppercase mt-1">NA RETIRADA DO SEU PEDIDO ONLINE</p>
      </div>

      <p className="text-xs my-1 text-center opacity-30">{separator}</p>
      
      <div className="text-center text-[10px] mt-2 px-1 leading-tight">
        <p className="font-medium">Válido para a compra de qualquer produto na loja na data da retirada do seu pedido.</p>
      </div>
      
      <p className="text-xs my-1 mt-4 text-center opacity-30">{separator}</p>
      
      {/* Controle Interno Simplificado */}
      <div className="text-left text-[10px] mt-2 px-1 border border-black p-3 rounded-md">
        <p className="font-bold text-center mb-2 text-xs border-b border-black pb-1">USO INTERNO - CONTROLE</p>
        <div className="space-y-2 mt-2">
          <p>PEDIDO Nº: ________________________</p>
          <div className="flex justify-between">
            <p>DATA: ____/____/____</p>
            <p className="font-bold">ADICIONAL: ( ) S ( ) N</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
          <p className="text-[9px] italic opacity-60">Consulte condições de uso com o gerente da loja.</p>
      </div>

      {/* Efeito de papel rasgado (visual apenas na tela) */}
      <div 
        className="torn-effect absolute bottom-0 left-0 right-0 h-3 bg-repeat-x no-print"
        style={{
            backgroundImage: `radial-gradient(circle at 50% 0, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 100%, #ffffff 0px, #ffffff 1.5px, transparent 1.5px)`,
            backgroundSize: `6px 3px`,
            backgroundPosition: '0 -1.5px, 0 100%',
        }}
      />
    </Card>
  );
}
