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
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const eventFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "O título deve ter pelo menos 2 caracteres." }).max(40, { message: "O título não pode exceder 40 caracteres." }),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Data inválida." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  description: z.string().max(200, { message: "A descrição não pode exceder 200 caracteres." }).optional().default(''),
  predefinedEvent: z.string().optional(),
  isHappySábado: z.boolean().optional(),
});

export type EventData = z.infer<typeof eventFormSchema>;

const PREDEFINED_EVENTS = {
  pokemon: {
    title: "Troca de cartas POKEMON",
    description: "Venha aumentar a sua coleção de cards com outros Mestre Pokemon",
  },
  uno_beyblade: {
    title: "Partidas de UNO e Arena Beyblade",
    description: "Competição entre amigos e familiares",
  },
  hotwheels: {
    title: "Abertura de caixas Hot Wheels",
    description: "O momento mais esperado pelos colecionadores",
  },
  outro: {
    title: "",
    description: "",
  },
};

interface EventFormProps {
  onDataChange: (data: EventData) => void;
  initialData: EventData;
  onRemove: () => void;
  showRemoveButton: boolean;
  isSameThemeAllMonth: boolean;
  isFirstEvent: boolean;
}

export function EventForm({ onDataChange, initialData, onRemove, showRemoveButton, isSameThemeAllMonth, isFirstEvent }: EventFormProps) {
  const form = useForm<EventData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const isSaturday = new Date(form.watch('date') + 'T00:00:00').getDay() === 6;

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      let updatedValue = { ...value };
      
      if (name === 'predefinedEvent' && value.predefinedEvent && value.predefinedEvent !== 'outro') {
        const eventKey = value.predefinedEvent as keyof typeof PREDEFINED_EVENTS;
        const predefined = PREDEFINED_EVENTS[eventKey];
        updatedValue.title = predefined.title;
        updatedValue.description = predefined.description;
        form.reset(updatedValue); // Reset form to apply changes
      }

      if (name === 'isHappySábado' || name === 'title') {
         const currentTitle = updatedValue.title || '';
         if (updatedValue.isHappySábado && !currentTitle.startsWith('Happy Sábado - ')) {
            updatedValue.title = `Happy Sábado - ${currentTitle}`;
         } else if (!updatedValue.isHappySábado && currentTitle.startsWith('Happy Sábado - ')) {
            updatedValue.title = currentTitle.replace('Happy Sábado - ', '');
         }
         form.setValue('title', updatedValue.title);
      }

      const result = eventFormSchema.safeParse(updatedValue);
      onDataChange(result.success ? result.data : updatedValue as EventData);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);


  function onSubmit(data: EventData) {
    console.log("Form submitted:", data);
  }

  const isDisabled = isSameThemeAllMonth && !isFirstEvent;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 border p-4 rounded-lg relative ${isDisabled ? 'opacity-50' : ''}`}>
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
        <fieldset disabled={isDisabled} className="space-y-6">
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
                    <SelectItem value="pokemon">Troca de cartas POKEMON</SelectItem>
                    <SelectItem value="uno_beyblade">Partidas de UNO e Arena Beyblade</SelectItem>
                    <SelectItem value="hotwheels">Abertura de caixas Hot Wheels</SelectItem>
                    <SelectItem value="outro">Outro (Manual)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Concerto de Ano Novo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isSaturday && (
            <FormField
              control={form.control}
              name="isHappySábado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>É um "Happy Sábado"?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                    placeholder="Descreva brevemente o evento..."
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
