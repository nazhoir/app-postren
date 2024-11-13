import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { SetupForm } from "./setup-form";
import { ModeToggle } from "@/components/mode-toggle";
import { countOrganization } from "./setup-action";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await countOrganization();
  if (data > 0) redirect("/auth/login");
  return (
    <>
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <p className="font-bold">
            <Link href={"/"}>Postren</Link>
          </p>
          <ModeToggle />
        </div>
      </header>
      <main className="container mx-auto flex min-h-[80vh] items-center justify-center px-6 py-8">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Mulai siapkan aplikasi</CardTitle>
          </CardHeader>

          <CardContent>
            <SetupForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
