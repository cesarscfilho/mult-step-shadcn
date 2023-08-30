"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStep,
} from "@/components/ui/form";
import { Input, PatternInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/use-toast";
import OtpInput from "./otp-input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CalendarIcon } from "lucide-react";

type FormData = {
  step: number;
  service: string,
  date: Date
  hour: string
  phone: string;
  code: string;
  name: string
};

const firstStepSchema = z.object({
  step: z.literal(1),
  service: z.string(),
  date: z.date(),
  hour: z.string(),
});

const secondStepSchema = firstStepSchema.extend({
  step: z.literal(2),
  phone: z.string(),
  name: z.string(),
});

const thirdStepSchema = secondStepSchema.extend({
step: z.literal(3),
code: z.string(),
});

const fourthStageScheme = secondStepSchema.extend({
    step: z.literal(4),
});

const schema = z.discriminatedUnion("step", [
  firstStepSchema,
  secondStepSchema,
  thirdStepSchema,
  fourthStageScheme
]);

export const SchedulingForm = () => {
    const services = ['Depilação facial', 'Corte']
    const hours = ['12:30 - 13:30', '13:30 - 14:30', '15:30 - 16:30']

  const maxSteps = 4;

  const form = useForm<FormData>({
    mode: "all",
    shouldFocusError: false,
    resolver: zodResolver(schema),
    defaultValues: {
      step: 1,
      phone: "",
      code: "",
    },
  });

  const step = form.watch("step");
  const phoneState = form.watch("phone");

  function onSubmit(values: FormData) {
    toast({
      title: "Form data:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  const prevStep = () => {
    if (step > 1) {
      form.setValue("step", step - 1, { shouldValidate: true });
    }
  };

  const nextStep = () => {
    if (step < maxSteps) {
      form.setValue("step", step + 1, { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        <FormStep
          step={1}
          currentStep={step}
          title="Você está entrando na agenda de Salão Pratrícia Pimentel"
          onPrevStepClick={prevStep}
        >
        <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Serviço</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {services.map((service) => {
                    return (
                        <SelectItem value={service.toString()} key={service}>
                        {service}
                        </SelectItem>
                    )
                    })}
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data do serviço</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value ? (
                      format(field.value, "'Dia' dd 'de' MMMM'", {
                        locale: pt,
                      })
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={pt}
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => {
                    const currentDate = new Date()
                    const minDate = new Date('1900-01-01')

                    const disabledDays = [
                      new Date(2023, 7, 25),
                      new Date(2023, 7, 22),
                    ]

                    return (
                      date < currentDate ||
                      date < minDate ||
                      disabledDays.some(
                        (disabledDate) =>
                          date.getFullYear() === disabledDate.getFullYear() &&
                          date.getMonth() === disabledDate.getMonth() &&
                          date.getDate() === disabledDate.getDate(),
                      )
                    )
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

        <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Horário do serviço</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue defaultValue="13:30 - 14:30" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {hours.map((hour) => {
                    return (
                        <SelectItem value={hour.toString()} key={hour}>
                        {hour}
                        </SelectItem>
                    )
                    })}
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        /> 
        </FormStep>
        <FormStep
          step={2}
          currentStep={step}
          title="Por favor, digite o seu número de celular."
          onPrevStepClick={prevStep}
        >
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de celular</FormLabel>
                <FormControl>
                  <PatternInput format="(##) #####-####"
                    placeholder="Phone..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        </FormStep>
        <FormStep
          step={3}
          currentStep={step}
          title="Por favor, verifique o seu número de celular."
          description={`Um código de verificação foi enviado para ${phoneState}. Insira o código abaixo.`}
          onPrevStepClick={prevStep}
        >
        <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OtpInput valueLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormStep>
        <FormStep
          step={4}
          currentStep={step}
          title="Seu número foi verificado!"
          description="Nós agradecemos a verificação do seu número de celular. Clique em CONFIRMAR para confirmar seu agendamento."
          onPrevStepClick={prevStep}
        />
        <Button
          key={step === maxSteps ? "submit-btn" : "next-step-btn"}
          type={step === maxSteps ? "submit" : "button"}
          className="w-full"
          variant={step === maxSteps ? "default" : "secondary"}
          disabled={!form.formState.isValid}
          onClick={step === maxSteps ? undefined : nextStep}
        >
          {step === maxSteps ? "Confirmar" : "Próximo"}
        </Button>
      </form>
    </Form>
  );
}