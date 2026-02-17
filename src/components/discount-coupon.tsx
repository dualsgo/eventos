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
      {/* Cabeçalho Institucional */}
      <div className="text-center mb-2">
        <h1 className="font-bold text-sm uppercase leading-tight tracking-tight">RI HAPPY - {storeName || 'LOJA'}</h1>
        <p className="text-[10px] opacity-70 px-2 mt-1 leading-tight uppercase font-bold">
          CUPOM DE DESCONTO EXCLUSIVO PARA COMPRA ADICIONAL NA RETIRADA DO PEDIDO ONLINE
        </p>
      </div>

      <p className="text-xs my-1 text-center opacity-30">{separator}</p>
      
      <div className="py-4 flex flex-col items-center">
        <h2 className="font-bold text-base uppercase tracking-widest leading-none mb-2">VOCÊ GANHOU!</h2>
        
        {/* Desconto Massivo */}
        <div className="flex flex-col items-center justify-center my-1">
          <span className="font-bold text-[100px] leading-none tracking-tighter">10%</span>
          <span className="font-bold text-4xl -mt-3 tracking-widest uppercase">OFF</span>
        </div>

        {/* Mensagem de Incentivo em Destaque */}
        <div className="border-2 border-black border-dashed p-2 my-4 w-full bg-gray-50">
           <p className="font-bold text-sm uppercase leading-tight">Aproveite para completar a brincadeira!</p>
        </div>
        
        <p className="text-xs font-bold uppercase mt-1">NA RETIRADA DO SEU PEDIDO ONLINE</p>
      </div>

      <p className="text-xs my-1 text-center opacity-30">{separator}</p>
      
      {/* Condições Claras */}
      <div className="text-center text-[10px] mt-2 px-1 leading-tight font-medium">
        <p>Válido para a compra de qualquer produto na loja na data da retirada do seu pedido.</p>
      </div>
      
      <p className="text-xs my-1 mt-6 text-center opacity-30">{separator}</p>
      
      {/* Controle Interno Simplificado */}
      <div className="text-center text-[12px] mt-2 py-1">
        <p className="font-bold uppercase tracking-tight text-base">Adicional ( ) Sim ( ) Não</p>
      </div>

      <div className="mt-6 mb-2">
          <p className="text-[10px] font-bold uppercase">Consulte condições de uso com</p>
          <p className="text-[10px] font-bold uppercase underline">UM DE NOSSOS ATENDENTES da loja.</p>
      </div>

      {/* Efeito visual de papel rasgado (apenas para tela) */}
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
