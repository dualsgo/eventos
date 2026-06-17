"use client";

import { useState } from "react";
import { LayoutGrid, BarChart2, CalendarClock, Image, X } from "lucide-react";

const TOOLS = [
  {
    label: "Dashboard de Análises",
    description: "Métricas e relatórios",
    href: "https://dashboardlojas.vercel.app/",
    icon: BarChart2,
    color: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50 hover:bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  {
    label: "Sistema de Escala",
    description: "Gestão de turnos",
    href: "https://rhescala.vercel.app/",
    icon: CalendarClock,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    label: "Sistema de Cartazes",
    description: "Criação de materiais",
    href: "https://rdcartaz.vercel.app/",
    icon: Image,
    color: "from-orange-500 to-pink-600",
    bg: "bg-orange-50 hover:bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
];

export function ToolsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tool links panel */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-200/70 p-3 flex flex-col gap-2 min-w-[220px]">
          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest px-1 pb-1 border-b border-zinc-100">
            Outras Ferramentas
          </p>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.href}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all border ${tool.bg} ${tool.border} group`}
                onClick={() => setOpen(false)}
              >
                <div
                  className={`h-8 w-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-sm shrink-0`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${tool.text}`}>
                    {tool.label}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {tool.description}
                  </p>
                </div>
                <svg
                  className={`h-3 w-3 shrink-0 opacity-40 group-hover:opacity-80 transition-opacity ${tool.text}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            );
          })}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu de ferramentas" : "Abrir menu de ferramentas"}
        className={`group h-13 w-13 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 border ${
          open
            ? "bg-zinc-900 border-zinc-700 text-white rotate-90"
            : "bg-white border-zinc-200/80 text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 hover:shadow-xl"
        }`}
        style={{ height: 52, width: 52 }}
      >
        <span className={`transition-all duration-300 ${open ? "scale-0 absolute" : "scale-100"}`}>
          <LayoutGrid className="h-5 w-5" />
        </span>
        <span className={`transition-all duration-300 ${open ? "scale-100" : "scale-0 absolute"}`}>
          <X className="h-5 w-5" />
        </span>
      </button>
    </div>
  );
}
