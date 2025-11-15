"use client";

import { useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const eventFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(100, { message: "O título não pode exceder 100 caracteres." }).optional().default(''),
  subtitle: z.string().max(50, { message: "O subtítulo não pode exceder 50 caracteres." }).optional().default(''),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Data inválida." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }).optional().default(''),
  description: z.string().max(200, { message: "A descrição não pode exceder 200 caracteres." }).optional().default(''),
  predefinedEvent: z.string().optional(),
});

export type EventData = z.infer<typeof eventFormSchema>;

const getNextDayOfWeek = (dayOfWeek: number): string => { // 0=Sunday, 1=Monday, ..., 6=Saturday
  const today = new Date();
  const resultDate = new Date(today.getTime());
  let daysToAdd = (dayOfWeek + 7 - today.getDay()) % 7;
  if (daysToAdd === 0 && today.getDay() === dayOfWeek) {
    daysToAdd = 7; // if it's today, get next week's day
  } else if (daysToAdd === 0) {
    daysToAdd = 0; // if we want Sunday and it's Sunday, we might want today, adjust if necessary
  }
   if (resultDate.getDay() === dayOfWeek) {
     resultDate.setDate(resultDate.getDate() + 7);
   } else {
     resultDate.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7);
   }

  // If we calculated today, add 7 days.
  if(resultDate.getDate() === today.getDate()){
    resultDate.setDate(resultDate.getDate() + 7);
  }
  
  const finalDate = new Date(today.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7));


  return new Date(today.getTime() - (today.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
};

const getNextDayOfWeekAdvanced = (dayOfWeek: number): string => {
    const now = new Date();
    const result = new Date(now);
    result.setDate(now.getDate() + (dayOfWeek + (7 - now.getDay())) % 7);
    if (result.getDate() === now.getDate()) {
        result.setDate(result.getDate() + 7);
    }
    return result.toISOString().split('T')[0];
};


const PREDEFINED_EVENTS = {
  pokemon: {
    title: "Troca de cartas POKEMON",
    description: "Venha aumentar a sua coleção de cards com outros Mestres Pokemon.",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => getNextDayOfWeekAdvanced(5), // Friday
  },
  uno_beyblade: {
    title: "Partidas de UNO e Arena Beyblade",
    description: "Competição entre amigos e familiares.",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => getNextDayOfWeekAdvanced(5), // Friday
  },
  hotwheels: {
    title: "Abertura de caixas Hot Wheels",
    description: "O momento mais esperado pelos colecionadores.",
    startTime: "19:00",
    endTime: "",
    defaultDate: () => getNextDayOfWeekAdvanced(5), // Friday
  },
  happy_sabado: {
    title: "Happy Sábado - ",
    description: "Atividades e brincadeiras especiais todo sábado.",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => getNextDayOfWeekAdvanced(6), // Saturday
  },
  outro: {
    title: "",
    description: "",
    startTime: "14:00",
    endTime: "20:00",
    defaultDate: () => new Date().toISOString().split('T')[0],
  },
};

interface EventFormProps {
  onDataChange: (data: EventData) => void;
  initialData: EventData;
  onRemove: () => void;
  showRemoveButton: boolean;
  isSameThemeAllMonth: boolean;
}

export function EventForm({ onDataChange, initialData, onRemove, showRemoveButton, isSameThemeAllMonth }: EventFormProps) {
  const form = useForm<EventData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const predefinedEvent = form.watch("predefinedEvent");

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      let updatedValue = { ...value } as EventData;
      
      if (name === 'predefinedEvent' && value.predefinedEvent) {
        const eventKey = value.predefinedEvent as keyof typeof PREDEFINED_EVENTS;
        const predefined = PREDEFINED_EVENTS[eventKey] || PREDEFINED_EVENTS.outro;
        
        updatedValue.title = predefined.title;
        updatedValue.description = predefined.description;
        updatedValue.startTime = predefined.startTime;
        updatedValue.endTime = predefined.endTime;
        updatedValue.date = predefined.defaultDate();

        if(eventKey !== 'happy_sabado') {
          updatedValue.subtitle = '';
        }

        form.reset(updatedValue);
      } else if (name === 'subtitle' && value.predefinedEvent === 'happy_sabado') {
        updatedValue.title = PREDEFINED_EVENTS.happy_sabado.title + (value.subtitle || '');
      }
      
      const result = eventFormSchema.safeParse(updatedValue);
      if (result.success) {
        onDataChange(result.data);
      } else {
        // This is important to keep the form state in sync even with invalid data
        // while the user is typing.
        onDataChange(updatedValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);


  function onSubmit(data: EventData) {
    // This function is for form submission, which we handle via onChange
    console.log("Form submitted:", data);
  }

  const isDisabled = isSameThemeAllMonth && predefinedEvent === 'happy_sabado';
  const isHappySabado = predefinedEvent === 'happy_sabado';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 border p-4 rounded-lg relative`}>
         {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Remover Evento</span>
          </Button>
        )}
        <fieldset disabled={isDisabled} className={`space-y-6 ${isDisabled ? 'opacity-50' : ''}`}>
          <FormField
            control={form.control}
            name="predefinedEvent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento Predefinido</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um evento predefinido" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="happy_sabado">Happy Sábado (Evento temático de sábado)</SelectItem>
                    <SelectItem value="pokemon">Troca de cartas POKEMON (Evento de sexta)</SelectItem>
                    <SelectItem value="uno_beyblade">UNO e Beyblade (Evento de sexta)</SelectItem>
                    <SelectItem value="hotwheels">Caixas Hot Wheels (Evento de sexta)</SelectItem>
                    <SelectItem value="outro">Outro (Preenchimento manual)</SelectItem>
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
                    <Input placeholder="Ex: Oficina de Slime" {...field} />
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
                    <Input placeholder="Ex: Lançamento do Novo Brinquedo" {...field} disabled={predefinedEvent !== 'outro'} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Início</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fim</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
