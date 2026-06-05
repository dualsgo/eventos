"use client";

import React from 'react';
import QRCode from 'react-qr-code';
import { Card } from '@/components/ui/card';

interface SurveyInviteCouponProps {
  storeCode: string;
  storeName: string;
  brand?: 'ri_happy' | 'pb_kids';
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

const BRAND_LABELS: Record<'ri_happy' | 'pb_kids', string> = {
  ri_happy: 'RI HAPPY',
  pb_kids: 'PB KIDS',
};

export function SurveyInviteCoupon({ storeCode, storeName, brand }: SurveyInviteCouponProps) {
  const separator = "----------------------------------------";
  const headerBrand = brand ? BRAND_LABELS[brand] : 'RI HAPPY';
  
  // URL final de pesquisa para o QR Code
  const surveyUrl = `https://qr.otg.chat/rhpy-eln-${storeCode}`;

  return (
    <Card
      className="receipt p-4 font-code shadow-lg transition-all relative overflow-hidden bg-white text-black text-center border-none"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      {/* Cabeçalho */}
      <div className="text-center mb-2">
        <h1 className="font-bold text-base uppercase leading-tight tracking-tight">PESQUISA DE OPINIÃO</h1>
        <h2 className="font-bold text-sm break-words uppercase mt-1">
          {headerBrand} - {storeName || 'UNIDADE'}
        </h2>
      </div>

      <p className="text-xs my-2 text-center tracking-tighter opacity-30">{separator}</p>

      {/* Mensagem de Convite */}
      <div className="text-center my-4 space-y-2">
        <h3 className="font-bold text-lg uppercase leading-tight">Sua voz faz a diferença!</h3>
        <p className="text-sm font-medium">Avalie sua experiência conosco e nos ajude a melhorar.</p>
      </div>

      <div className="flex justify-center my-4">
        <div className="bg-white p-2 rounded-xl">
          <QRCode
            value={surveyUrl}
            size={160}
            level="M"
            className="w-40 h-40"
          />
        </div>
      </div>

      <p className="text-xs my-2 text-center tracking-tighter opacity-30">{separator}</p>

      {/* Link em Texto para Segurança */}
      <div className="text-center text-xs mt-2 px-1">
        <p className="font-medium">Ou acesse pelo link:</p>
        <p className="font-bold mt-1 break-all inline-block">
          {surveyUrl}
        </p>
      </div>

      {/* Efeito visual de papel rasgado (apenas tela) */}
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
