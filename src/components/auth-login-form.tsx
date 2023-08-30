"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormStep,
} from "@/components/ui/form";
import { Input, PatternInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios"

import { toast } from "@/components/ui/use-toast";
import OtpInput from "./otp-input";
import { useCallback, useEffect, useState } from "react";
import { formatPhoneNumber, unformatPhoneNumber } from "@/lib/utils";
import { Label } from "./ui/label";

type FormData = {
  step: number;
  phone: string;
  code: string;
};

const firstStepSchema = z.object({
  step: z.literal(1),
  phone: z.string().max(15).min(15)
});

const secondStepSchema = firstStepSchema.extend({
  step: z.literal(2),
  code: z.string().min(4).max(4),
});

const thirdStepSchema = secondStepSchema.extend({
  step: z.literal(3),
});

const loginSchema = z.discriminatedUnion("step", [
  firstStepSchema,
  secondStepSchema,
  thirdStepSchema,
]);

export const AuthLoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<FormData>({
    mode: "all",
    shouldFocusError: false,
    resolver: zodResolver(loginSchema),
    defaultValues: {
      step: 1,
      phone: "",
      code: "",
    },
  });
  
  const step = form.watch("step");
  const phoneState = form.watch("phone");
  const phoneUnformated = unformatPhoneNumber(phoneState)
  const codeState = form.watch("code");
  const maxSteps = 3;
  
  const onSubmit = (values: FormData) => {
    toast({
      title: "Form data:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  const checkPhone = async () => {
    console.log("Check")
  }

  const sendCodeOtp = async () => {
    setIsLoading(true)
    const payload = {
      phone: phoneUnformated,
      template: 'login-confirmation-code',
      confirmationCodeType: 'est-login',
    }

    try {
      await axios.post(
        'http://ec2-3-90-42-234.compute-1.amazonaws.com:3000/auth/send-code',
        payload,
        )
      } catch (error) {}
  }

  const checkCodeOtp = useCallback(async () => {
    setIsLoading(true);
    const payload = {
      phone: phoneUnformated,
      confirmationCode: codeState,
      confirmationCodeType: 'est-login',
    };

    try {
      const { data } = await axios.post(
        'http://ec2-3-90-42-234.compute-1.amazonaws.com:3000/auth/confirm-code',
        payload
      );

      if(!data.token){
        setIsLoading(true);
      }
    } catch (error) {}
  }, [phoneUnformated, codeState]);

  const prevStep = () => {
    if (step > 1) {
      form.setValue("step", step - 1, { shouldValidate: true });
    }
  };

  const nextStep = async () => {
    if(step === 1) {
      await sendCodeOtp()
    }

    if(step === 2) {
      await checkCodeOtp()
    }

    if (step < maxSteps) {
      setIsLoading(false)
      form.setValue("step", step + 1, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if(phoneState.length === 15){
      checkPhone()
    }
  }, [phoneState])

  useEffect(() => {
    if(codeState.length === 4){
    }
    
  }, [codeState])

  useEffect(() => {
    form.setValue('phone', formatPhoneNumber(phoneState))
  }, [phoneState, form.setValue, form])

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
              <Label>Número de celular</Label>
              <FormControl>
                <Input 
                  placeholder="(27) 12345-6789" {...field} />
              </FormControl>
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
          isLoading={isLoading}
          disabled={!form.formState.isValid || isLoading}
          onClick={step === maxSteps ? undefined : nextStep}
        >
          {step === maxSteps ? "Entrar" : "Próximo"}
        </Button>
      </form>
    </Form>
  );
}