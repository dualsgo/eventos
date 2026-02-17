"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const eventFormSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string()
      .max(100, { message: "O título não pode exceder 100 caracteres." })
      .optional()
      .default(""),
    subtitle: z
      .string()
      .max(50, { message: "O subtítulo não pode exceder 50 caracteres." })
      .optional(),
    date: z
      .string()
      .refine((val: string) => val && !isNaN(Date.parse(val)), {
        message: "Data inválida.",
      }),
    timeFormat: z.enum(["range", "from"]).default("range"),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Formato de hora inválido (HH:MM).",
      }),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Formato de hora inválido (HH:MM).",
      })
      .optional()
      .default(""),
    description: z
      .string()
      .max(200, { message: "A descrição não pode exceder 200 caracteres." })
      .optional()
      .default(""),
    predefinedEvent: z.string().optional(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data: any) => !(data.predefinedEvent === "happy_sabado" && !data.subtitle),
    {
      message: "O subtítulo é obrigatório para Happy Sábado.",
      path: ["subtitle"],
    },
  );

export type EventData = z.infer<typeof eventFormSchema>;

const getNextDayOfWeekAdvanced = (dayOfWeek: number): string => {
  const now = new Date();
  const result = new Date(now);
  result.setDate(now.getDate() + ((dayOfWeek + (7 - now.getDay())) % 7));
  if (result.getDate() === now.getDate()) {
    result.setDate(result.getDate() + 7);
  }
  return result.toISOString().split("T")[0];
};

const PREDEFINED_EVENTS = {
  pokemon: {
    title: "Troca de cartas POKEMON",
    description:
      "Venha aumentar a sua coleção de cards com outros Mestres Pokemon.",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => getNextDayOfWeekAdvanced(5), // Friday
    timeFormat: "range" as const,
  },
  uno_beyblade: {
    title: "Partidas de UNO e Arena Beyblade",
    description: "Competição entre amigos e familiares.",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => getNextDayOfWeekAdvanced(5), // Friday
    timeFormat: "range" as const,
  },
  hotwheels: {
    title: "Abertura de caixas Hot Wheels",
    description: "O momento mais esperado pelos colecionadores.",
    startTime: "19:00",
    endTime: "",
    defaultDate: () => getNextDayOfWeekAdvanced(5), // Friday
    timeFormat: "from" as const,
  },
  happy_sabado: {
    title: "Happy Sábado - ",
    description: "Atividades e brincadeiras especiais todo sábado.",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => getNextDayOfWeekAdvanced(6), // Saturday
    timeFormat: "range" as const,
  },
  outro: {
    title: "",
    description: "",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => new Date().toISOString().split("T")[0],
    timeFormat: "range" as const,
  },
};

interface EventFormProps {
  onDataChange: (data: EventData) => void;
  initialData: EventData;
  onRemove: () => void;
  showRemoveButton: boolean;
  isSameThemeAllMonth: boolean;
}

export function EventForm({
  onDataChange,
  initialData,
  onRemove,
  showRemoveButton,
  isSameThemeAllMonth,
}: EventFormProps) {
  const form = useForm<EventData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const timeFormat = form.watch("timeFormat");
  const predefinedEvent = form.watch("predefinedEvent");
  
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  // Sync internal state with external updates (but only if ID or basic values change to avoid loops)
  useEffect(() => {
    if (initialData.id !== form.getValues('id')) {
        form.reset(initialData);
    }
  }, [initialData, form]);

  // Monitor all changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      const result = eventFormSchema.safeParse(value);
      if (result.success) {
        onDataChangeRef.current(result.data as EventData);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handlePredefinedChange = (val: string) => {
    const eventKey = val as keyof typeof PREDEFINED_EVENTS;
    const predefined = PREDEFINED_EVENTS[eventKey] || PREDEFINED_EVENTS.outro;

    const currentValues = form.getValues();
    const newSubtitle = eventKey === "happy_sabado" ? currentValues.subtitle || "" : "";
    const newTitle = eventKey === "happy_sabado" ? predefined.title + newSubtitle : predefined.title;

    const newValues: EventData = {
      ...currentValues,
      predefinedEvent: val,
      title: newTitle,
      description: predefined.description,
      startTime: predefined.startTime,
      endTime: predefined.endTime,
      date: predefined.defaultDate(),
      timeFormat: predefined.timeFormat,
      subtitle: newSubtitle,
    };

    form.reset(newValues);
    onDataChangeRef.current(newValues);
  };

  const isDisabled = isSameThemeAllMonth && predefinedEvent === "happy_sabado";
  const isHappySabado = predefinedEvent === "happy_sabado";

  return (
    <Form {...form}>
      <form className="space-y-6 relative">
        {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-8 w-8"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Remover Evento</span>
          </Button>
        )}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Evento Ativo</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <fieldset
          disabled={isDisabled}
          className={`space-y-6 ${isDisabled ? "opacity-50" : ""}`}
        >
          <FormField
            control={form.control}
            name="predefinedEvent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento Predefinido</FormLabel>
                <Select 
                  onValueChange={(val) => {
                    field.onChange(val);
                    handlePredefinedChange(val);
                  }} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um evento predefinido" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="happy_sabado">
                      Happy Sábado (Evento temático de sábado)
                    </SelectItem>
                    <SelectItem value="pokemon">
                      Troca de cartas POKEMON (Evento de sexta)
                    </SelectItem>
                    <SelectItem value="uno_beyblade">
                      UNO e Beyblade (Evento de sexta)
                    </SelectItem>
                    <SelectItem value="hotwheels">
                      Caixas Hot Wheels (Evento de sexta)
                    </SelectItem>
                    <SelectItem value="outro">
                      Outro (Preenchimento manual)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isHappySabado ? (
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo do Happy Sábado</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Oficina de Slime"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue('title', PREDEFINED_EVENTS.happy_sabado.title + e.target.value);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Evento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Lançamento do Novo Brinquedo"
                      {...field}
                      disabled={predefinedEvent !== "outro"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeFormat"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Formato do Horário</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => {
                      field.onChange(val);
                      if (val === 'from') form.setValue('endTime', '');
                    }}
                    value={field.value}
                    className="flex items-center space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="range" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Intervalo
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="from" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        A partir de
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {timeFormat === "from" ? "Horário" : "Início"}
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {timeFormat === "range" && (
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva brevemente os detalhes do evento..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    disabled={predefinedEvent !== "outro" && !field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  );
}