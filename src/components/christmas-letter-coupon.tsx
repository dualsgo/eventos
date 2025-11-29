"use client";

import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ChristmasLetterCouponProps {
  storeName: string;
}

const RECEIPT_WIDTH_PX = 302;
const RECEIPT_MIN_HEIGHT_PX = 113;

export function ChristmasLetterCoupon({ storeName }: ChristmasLetterCouponProps) {
  const separator = "----------------------------------------";
  const campaignLink = "https://checkindigital.rihappy.com.br/evento?codigo=a529d63d-e332-4fde-b6fd-78b8dfcc22c4";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(campaignLink)}`;

  return (
    <Card
      className="receipt p-3 font-code shadow-lg transition-all relative overflow-hidden bg-gray-50 text-black"
      style={{ width: `${RECEIPT_WIDTH_PX}px`, minHeight: `${RECEIPT_MIN_HEIGHT_PX}px` }}
    >
      <div className="text-center">
        <h1 className="font-bold text-sm break-words uppercase">{storeName || 'NOME DA LOJA'}</h1>
        <h2 className="font-bold text-base break-words uppercase mt-2">CARTINHA DE NATAL – COMO PARTICIPAR</h2>
      </div>

      <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>
      
      <div className="text-left text-xs mt-2 px-1 space-y-2">
        <div>
          <h3 className="font-bold uppercase">1. O que é a ação?</h3>
          <p>A campanha permite que crianças escrevam seus pedidos de Natal e depositem suas cartinhas na urna da loja. O objetivo é registrar esses desejos e criar uma comunicação especial com as famílias.</p>
        </div>
        
        <div>
          <h3 className="font-bold uppercase">2. Como participar</h3>
          <p>1) Retire a cartinha impressa.</p>
          <p>2) Preencha com o pedido de Natal.</p>
          <p>3) Deposite na urna da loja.</p>
        </div>

        <div>
          <h3 className="font-bold uppercase">3. Cadastro obrigatório</h3>
          <p>Para a participação ser válida, o responsável deve fazer o cadastro digital no momento em que a cartinha é depositada. Isso garante a identificação correta da criança e a organização da ação.</p>
        </div>

        <div>
          <h3 className="font-bold uppercase">4. Como realizar o cadastro</h3>
          <p className="font-bold text-center my-1">Aponte a câmera para o QR Code</p>
          <div className="flex justify-center my-2">
            <Image 
              src={qrCodeUrl}
              alt="QR Code para cadastro na campanha"
              width={80}
              height={80}
            />
          </div>
          <p className="text-center text-[10px] break-all">Ou acesse: {campaignLink}</p>
        </div>

        <div>
          <h3 className="font-bold uppercase">5. O que preencher</h3>
          <p>Serão solicitados dados do responsável, da criança e as informações do pedido. Preencha com atenção.</p>
        </div>
        
        <div>
            <h3 className="font-bold uppercase">6. Regras Essenciais</h3>
            <p>A participação só é confirmada após o cadastro digital. A cartinha na urna sem cadastro não será identificada.</p>
        </div>
        
        <div>
            <h3 className="font-bold uppercase">7. Após o cadastro</h3>
            <p>Você receberá a confirmação e a loja continuará o contato com conteúdos personalizados.</p>
        </div>
        
         <p className="text-xs my-1 text-center tracking-tighter">{separator}</p>

        <div className="text-center">
            <h3 className="font-bold uppercase">Dúvidas?</h3>
            <p>Procure um colaborador da loja. Estamos à disposição para ajudar.</p>
        </div>
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
