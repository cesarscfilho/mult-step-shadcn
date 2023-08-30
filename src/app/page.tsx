import { Metadata } from "next"

import { AuthLoginForm } from "@/components/auth-login-form"
import { SchedulingForm } from "@/components/scheduling-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
      <Tabs defaultValue="login">
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-12 sm:w-[350px]">
            <TabsList className="absolute top-10 mx-auto translate-x-1/2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="schedulign">Schedulign</TabsTrigger>
            </TabsList>
          <span className="text-center text-muted-foreground">Logo aqui</span>
            <TabsContent value="login"><AuthLoginForm /></TabsContent>
            <TabsContent value="schedulign"> <SchedulingForm /></TabsContent>
          </div>
        </div>
      </Tabs>
  )
}