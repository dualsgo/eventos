"use client";

export function AgingLabel() {
  const Label = () => (
    <div className="flex flex-col items-center justify-center bg-white text-black text-center overflow-hidden border-r border-dashed border-gray-200 last:border-r-0 print:border-none" 
         style={{ width: '50mm', height: '15mm', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="uppercase font-bold tracking-widest text-2xl leading-none m-0 p-0">
        AGING
      </h1>
    </div>
  );

  return (
    <div className="flex bg-white shadow-xl print:shadow-none" style={{ width: '100mm', height: '15mm' }}>
      <Label />
      <Label />
    </div>
  );
}
