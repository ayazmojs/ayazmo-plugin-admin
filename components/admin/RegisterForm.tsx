"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "ayazmo-plugin-admin/components/ui/card"
import { Label } from "ayazmo-plugin-admin/components/ui/label"
import { Input } from "ayazmo-plugin-admin/components/ui/input"
import { Button } from "ayazmo-plugin-admin/components/ui/button"
import { createAdmin } from "./actions";

const initialState = {
  message: "",
};

export default function RegisterForm() {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createAdmin, initialState);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Account setup</CardTitle>
        <CardDescription>Enter your details below to complete your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form action={formAction}>
          <div className="space-y-2">
              <Label htmlFor="first_name">Frist name</Label>
              <Input id="first_name" name="first_name" placeholder="First name" required type="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" name="last_name" placeholder="Last name" required type="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="admin@example.com" required type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" required type="password" />
            </div>
            <div className="mt-4">
              <Button className="w-full" type="submit" aria-disabled={pending}>
                Register
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}