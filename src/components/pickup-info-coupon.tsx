
"use client";

import { Card } from '@/components/ui/card';
import { ShoppingCart, Store, Clock, Sun } from 'lucide-react';
import Image from 'next/image';

interface PickupInfoCouponProps {
  storeName: string;
}

const RECEIPT_WIDTH_PX = 302;

export function PickupInfoCoupon({ storeName }: PickupInfoCouponProps) {
  const separator = "----------------------------------------";
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.rihappy.com.br/retira-em-loja";

  return (
    <Card
      className="receipt p-0 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px` }}
    >
      {/* Topo Institucional - Roxo */}
      <div className="bg-[#612D87] text-white py-3 px-2 flex items-center justify-center gap-2">
        <Sun className="fill-yellow-400 text-yellow-400 h-8 w-8" />
        <h1 className="font-bold text-sm leading-tight uppercase tracking-tight">
          RETIRA EM LOJA RI HAPPY
        </h1>
      </div>

      <div className="p-3">
        <div className="text-center mb-1">
          <h2 className="font-bold text-xs break-words uppercase text-gray-500">{storeName || 'SUA LOJA'}</h2>
        </div>

        <div className="my-3 flex flex-col items-center gap-2">
            {/* Camada 1: COMPRE NO SITE */}
            <div className="bg-[#E10098] text-white w-full py-2 px-3 rounded-xl flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 shrink-0" />
                <div className="text-left">
                    <p className="font-bold text-sm leading-none">COMPRE NO SITE</p>
                    <p className="text-[10px] opacity-90">OU APP RI HAPPY</p>
                </div>
            </div>

            {/* Camada 2: RETIRE NA LOJA */}
            <div className="bg-[#612D87] text-white w-full py-2 px-3 rounded-xl flex items-center gap-3">
                <Store className="h-6 w-6 shrink-0" />
                <div className="text-left">
                    <p className="font-bold text-sm leading-none">RETIRE NA LOJA</p>
                    <p className="text-[10px] opacity-90">ESCOLHA SUA LOJA</p>
                </div>
            </div>

            {/* Camada 3: BENEFÍCIO */}
            <div className="bg-[#00B5E2] text-white w-full py-2 px-3 rounded-xl flex items-center gap-3">
                <Clock className="h-6 w-6 shrink-0" />
                <div className="text-left">
                    <p className="font-bold text-sm leading-none">EM ATÉ 90 MINUTOS</p>
                    <p className="text-[10px] opacity-90">APÓS CONFIRMAÇÃO</p>
                </div>
            </div>
        </div>

        <p className="text-xs my-1 text-center opacity-30">{separator}</p>
        
        <div className="text-center my-3">
            <div className="bg-yellow-400 rounded-full py-2 px-4 inline-block border-2 border-black rotate-[-2deg] shadow-sm">
                <p className="font-bold text-sm uppercase leading-none">+ 10% OFF NO DIA!</p>
            </div>
        </div>

        <p className="text-xs my-1 text-center opacity-30">{separator}</p>
        
        <div className="flex flex-col items-center my-2">
            <Image 
                src={qrCodeUrl}
                alt="QR Code Retira em Loja"
                width={100}
                height={100}
                className="mb-1 border p-1 bg-white"
            />
            <p className="text-[10px] leading-tight font-bold uppercase mt-1">Aponte a câmera e saiba mais!</p>
        </div>

        <p className="text-xs my-1 text-center opacity-30">{separator}</p>
        
        <div className="text-[8px] leading-tight px-1 italic opacity-60">
            <p>Consulte disponibilidade por CEP. O prazo de 90min conta a partir da abertura da loja. Aguarde o e-mail "Pedido Pronto para Retirada".</p>
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
