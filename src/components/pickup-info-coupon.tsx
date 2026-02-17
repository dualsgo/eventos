"use client";

import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface PickupInfoCouponProps {
  storeName: string;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

export function PickupInfoCoupon({ storeName }: PickupInfoCouponProps) {
  const separator = "----------------------------------------";
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.rihappy.com.br/retira-em-loja";

  return (
    <Card
      className="receipt p-3 font-code shadow-lg transition-all relative overflow-hidden bg-gray-50 text-black text-center"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      <div className="text-center">
        <h1 className="font-bold text-sm break-words uppercase">RETIRA EM LOJA</h1>
        <h2 className="font-bold text-base break-words uppercase mt-1">RI HAPPY - {storeName || 'SUA LOJA'}</h2>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-center my-3 px-1">
        <p className="font-bold text-lg leading-tight uppercase">COMPRE ONLINE E RETIRE NA LOJA!</p>
        <p className="font-bold text-sm mt-2 text-primary-foreground bg-black text-white p-1 inline-block">GANHE 10% DE DESCONTO</p>
        <p className="text-xs font-bold mt-1">PARA USAR NO MESMO DIA DA RETIRADA!</p>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-left text-xs px-1 space-y-2">
        <p className="font-bold text-center underline">COMO FUNCIONA:</p>
        <p>1. COMPRE NO SITE OU APP DA RI HAPPY.</p>
        <p>2. NO CHECKOUT, ESCOLHA "RETIRAR NA LOJA".</p>
        <p>3. AO RETIRAR, GANHE 10% OFF PARA SUA PRÓXIMA COMPRA NO MESMO DIA.</p>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>

      <div className="text-left text-xs px-1 space-y-1">
        <p className="font-bold text-center underline">VANTAGENS:</p>
        <p>• SEM ESPERA PELA ENTREGA</p>
        <p>• ECONOMIA COM FRETE GRÁTIS</p>
        <p>• DESCONTO IMEDIATO NA LOJA</p>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="flex flex-col items-center my-2">
        <Image 
          src={qrCodeUrl}
          alt="QR Code Retira em Loja"
          width={100}
          height={100}
          className="mb-1"
        />
        <p className="text-[10px] leading-tight">Aponte a câmera para saber mais e conferir o regulamento oficial.</p>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-[9px] leading-tight px-1 italic">
        <p>Consulte disponibilidade por CEP. O prazo de 90min para retirada conta a partir da abertura da loja. Aguarde o e-mail de confirmação.</p>
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
