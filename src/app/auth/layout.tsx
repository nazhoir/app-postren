import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session) redirect("/dashboard");

  return <div>{children}</div>;
}
