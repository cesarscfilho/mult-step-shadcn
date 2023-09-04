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
import { cn, formatPhoneNumber } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { Label } from "@radix-ui/react-label";

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
  phone: z.string().max(15).min(15),
  name: z.string().min(4),
});

const thirdStepSchema = secondStepSchema.extend({
step: z.literal(3),
code: z.string().min(4),
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

export const ExampleTwo = () => {
    const items123 = ['Item 1', 'Item 2', "Item 3"]
    const itemsABC = ['Item A', 'Item B', "Item C"]

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

  useEffect(() => {
    form.setValue('phone', formatPhoneNumber(phoneState))
  }, [phoneState, form.setValue, form])

  return (
    <Form {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        <FormStep
          step={1}
          currentStep={step}
          title="Lorem Ipsum is simply dummy text."
          description="Lorem Ipsum has been a galley of type and scrambled it to make a type specimen book"
          onPrevStepClick={prevStep}
        >
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
          <FormItem>
              <Label>Items 123</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                  <SelectTrigger>
                  <SelectValue defaultValue={field.value} />
                  </SelectTrigger>
              </FormControl>
              <SelectContent>
                  {items123.map((item, i) => {
                  return (
                    <SelectItem value={item.toString()} key={i}>
                    {item}
                    </SelectItem>
                  )
                  })}
              </SelectContent>
              </Select>
          </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
          <FormItem className="flex flex-col">
            <Label>Pick a date</Label>
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
                      <span>Pick a date</span>
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
          </FormItem>
        )}
      />

        <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
            <FormItem>
                <Label>Items ABC</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue defaultValue="13:30 - 14:30" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {itemsABC.map((item) => {
                    return (
                        <SelectItem value={item.toString()} key={item}>
                        {item}
                        </SelectItem>
                    )
                    })}
                </SelectContent>
                </Select>
            </FormItem>
            )}
        /> 
        </FormStep>
        <FormStep
          step={2}
          currentStep={step}
          title="Lorem Ipsum is simply dummy text."
          description="Lorem Ipsum has been a galley of type and scrambled it to make a type specimen book"
          onPrevStepClick={prevStep}
        >
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Label>Phone</Label>
                <FormControl>
                  <Input
                    placeholder="Phone..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Full name</Label>
                <FormControl>
                  <Input
                    placeholder="Name..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        
        </FormStep>
        <FormStep
          step={3}
          currentStep={step}
          title="Lorem Ipsum is simply dummy text."
          description="Lorem Ipsum has been a galley of type and scrambled it to make a type specimen book"
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
          step={4}
          currentStep={step}
          title="Lorem Ipsum is simply dummy text."
          description="Lorem Ipsum has been a galley of type and scrambled it to make a type specimen book"
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
          {step === maxSteps ? "Submit" : "Next"}
        </Button>
      </form>
    </Form>
  );
}