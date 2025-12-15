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
      className="receipt p-3 font-code shadow-lg transition-all relative overflow-hidden bg-gray-50 text-black text-center"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      <div className="text-center">
        <h1 className="font-bold text-sm break-words uppercase">{storeName || 'NOME DA LOJA'}</h1>
        <h2 className="font-bold text-sm break-words">CUPOM DE DESCONTO</h2>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-center my-4">
        <p className="font-bold text-2xl break-words">VOCÊ GANHOU</p>
        <p className="font-bold text-8xl leading-none tracking-tighter break-words">10%</p>
        <p className="font-bold text-3xl break-words uppercase">DE DESCONTO</p>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-center text-xs mt-2 px-1">
        <p>Válido para a compra de qualquer produto na loja na data da retirada do seu pedido.</p>
      </div>
      
      <div className="absolute bottom-3 left-3 right-3 text-xs">
          <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
          <p className="font-bold text-center">USO INTERNO DA LOJA</p>
          <p className="text-center mt-1">Adicional: [  ] Sim [  ] Não</p>
      </div>
      
      <div 
        className="torn-effect absolute bottom-0 left-0 right-0 h-3 bg-repeat-x"
        style={{
            backgroundImage: `radial-gradient(circle at 50% 0, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 100%, #f9fafb 0px, #f9fafb 1.5px, transparent 1.5px)`,
            backgroundSize: `6px 3px`,
            backgroundPosition: '0 -1.5px, 0 100%',
        }}
      />
    </Card>
  );
}
