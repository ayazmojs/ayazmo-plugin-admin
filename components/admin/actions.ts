"use server";

import { post } from "ayazmo-plugin-admin/lib/http-wrapper"
import { redirect } from 'next/navigation'

export async function createAdmin(
  prevState: { message: string },
  formData: FormData
) {
  try {
    await post('/admin/register', {
      body: JSON.stringify({
        username: formData.get('email'),
        password: formData.get('password'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name')
      })
    })

    return redirect('/login')
  } catch (error) {
    return { message: "Admin setup failed" };
  }
}