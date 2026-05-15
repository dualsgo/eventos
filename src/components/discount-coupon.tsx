"use client";

import { Card } from '@/components/ui/card';

type Brand = 'ri_happy' | 'pb_kids';

interface DiscountCouponProps {
  storeName: string;
  brand?: Brand;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

const BRAND_LABELS: Record<Brand, string> = {
  ri_happy: 'RI HAPPY',
  pb_kids: 'PB KIDS',
};

export function DiscountCoupon({ storeName, brand = 'ri_happy' }: DiscountCouponProps) {
  const separator = "----------------------------------------";
  const brandLabel = BRAND_LABELS[brand] || 'RI HAPPY';

  return (
    <Card
      className="receipt p-4 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      {/* Cabeçalho */}
      <div className="text-center mb-4">
        <h1 className="font-bold text-sm uppercase leading-tight tracking-tight">{brandLabel} - {storeName || 'LOJA'}</h1>
      </div>
      
      <div className="py-2 flex flex-col items-center">
        <h2 className="font-bold text-sm uppercase tracking-widest mb-1">VOCÊ GANHOU!</h2>
        
        {/* Desconto Massivo - O Coração do Cupom */}
        <div className="flex flex-col items-center justify-center">
          <span className="font-bold text-[110px] leading-none tracking-tighter">10%</span>
          <span className="font-bold text-4xl -mt-4 tracking-[0.2em] uppercase">OFF</span>
        </div>
        
        <div className="text-center mt-3 space-y-1">
          <p className="font-bold text-xs uppercase leading-tight">Válido para compra adicional</p>
          <p className="font-bold text-xs uppercase leading-tight">NA RETIRADA DO SEU PEDIDO</p>
          <p className="text-[11px] font-bold italic uppercase mt-2">Aproveite para completar a brincadeira!</p>
        </div>
      </div>

      {/* Controle Interno Ultra-Simples */}
      <div className="text-center py-2 mt-3">
        <p className="font-bold uppercase text-base tracking-tighter">ADICIONAL: ( ) SIM ( ) NÃO</p>
      </div>
      
      <div className="mt-4 text-center">
          <p className="text-[9px] font-bold uppercase leading-tight">Consulte um de nossos atendentes.</p>
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
