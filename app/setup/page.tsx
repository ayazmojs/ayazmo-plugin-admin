import React from 'react';
import { redirect } from 'next/navigation'
import { post } from "ayazmo-plugin-admin/lib/http-wrapper";
import RegisterForm from 'ayazmo-plugin-admin/components/admin/RegisterForm';
import { FormEvent } from 'react';

export default async function HomePage() {
  let setupIs = {
    allowed: false
  }
  try {
    setupIs = await post('/admin/setup', {
      body: JSON.stringify({
        check: 'test'
      })
    })

    if (!setupIs.allowed) {
      return redirect('/login')
    }
  } catch (error) {
    return redirect('/login')
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <RegisterForm />
    </main>
  );
}