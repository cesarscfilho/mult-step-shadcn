import { Metadata } from "next"

import { AuthLoginForm } from "@/components/auth-login-form"
import { SchedulingForm } from "@/components/scheduling-form"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-12 sm:w-[350px]">
      <span className="text-center text-muted-foreground">Logo aqui</span>
      {/* <AuthLoginForm /> */}
      <SchedulingForm />
      </div>
    </div>
  )
}