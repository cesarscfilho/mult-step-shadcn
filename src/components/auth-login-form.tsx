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
import { PatternFormat } from "react-number-format";

type FormData = {
  step: number;
  phone: string;
  code: string;
};

const firstStepSchema = z.object({
  step: z.literal(1),
  phone: z.string()
});

const secondStepSchema = firstStepSchema.extend({
  step: z.literal(2),
  code: z.string(),
});
const thirdStepSchema = secondStepSchema.extend({
  step: z.literal(3),
});

const schema = z.discriminatedUnion("step", [
  firstStepSchema,
  secondStepSchema,
  thirdStepSchema,
]);

export const AuthLoginForm = () => {
  const maxSteps = 3;

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
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormStep
          step={1}
          currentStep={step}
          title="Você está entrando na agenda de Salão Pratrícia Pimentel"
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
        </FormStep>
        <FormStep
          step={2}
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
          step={3}
          currentStep={step}
          title="Seu número foi verificado!"
          description="Nós agradecemos a verificação do seu número de celular."
          onPrevStepClick={prevStep}
        >
        </FormStep>
        <Button
          key={step === maxSteps ? "submit-btn" : "next-step-btn"}
          type={step === maxSteps ? "submit" : "button"}
          className="w-full"
          variant={step === maxSteps ? "default" : "secondary"}
          disabled={!form.formState.isValid}
          onClick={step === maxSteps ? undefined : nextStep}
        >
          {step === maxSteps ? "Entrar" : "Próximo"}
        </Button>
      </form>
    </Form>
  );
}