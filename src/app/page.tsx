import { Metadata } from "next"

import { ExampleOne } from "@/components/example-one"
import { ExampleTwo } from "@/components/example-two"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
      <Tabs defaultValue="example1">
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-12 sm:w-[350px]">
            <TabsList className="absolute top-10 mx-auto translate-x-1/2">
              <TabsTrigger value="example1">Exemple 1</TabsTrigger>
              <TabsTrigger value="example2">Example 2</TabsTrigger>
            </TabsList>
          <span className="text-center text-muted-foreground">Logo</span>
            <TabsContent value="example1"><ExampleOne /></TabsContent>
            <TabsContent value="example2"> <ExampleTwo /></TabsContent>
          </div>
        </div>
      </Tabs>
  )
}