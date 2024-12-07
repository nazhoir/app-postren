import React from 'react'
import UserEditFamilyForm from './user-edit-family-form'
import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const session = await auth();
    if (!session) return redirect("/auth/login");
  
    const { id } = await params;
  return (
    <UserEditFamilyForm userId={id}/>
  )
}
