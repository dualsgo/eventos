"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const eventFormSchema = z.object({
  title: z.string().min(2, { message: "O título deve ter pelo menos 2 caracteres." }).max(30, { message: "O título não pode exceder 30 caracteres." }),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Data inválida." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  description: z.string().max(200, { message: "A descrição não pode exceder 200 caracteres." }).optional().default(''),
});

export type EventData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  onDataChange: (data: EventData) => void;
  initialData: EventData;
}

export function EventForm({ onDataChange, initialData }: EventFormProps) {
  const form = useForm<EventData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const result = eventFormSchema.safeParse(value);
      if (result.success) {
        onDataChange(result.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);


  function onSubmit(data: EventData) {
    // This is a dummy handler as updates are real-time.
    console.log("Form submitted:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
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
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
