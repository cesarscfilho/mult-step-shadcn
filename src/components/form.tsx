"use client"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import OtpInput from "./otp-input"


export function Form() {
  const [step, setStep] = useState(0)
  const [otp, setOtp] = useState<string>('')

  const changeOtp = (value: string) => setOtp(value.trim())

  return (
    <Card>
      <CardHeader className="space-y-1 ">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        
        {step === 0 && 
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="phone" placeholder="(xx) xxxxx-xxxx" />
          </div>
        }

        {step === 1 && 
          <div className="grid gap-2">
            <OtpInput value={otp} valueLength={4} onChange={changeOtp} />
          </div>
        }

      </CardContent>
      <CardFooter>
        <Button onClick={() => setStep(step + 1)} className="w-full">Next</Button>
      </CardFooter>
    </Card>
  )
}