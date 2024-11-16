import React from "react";
import { CreateBulkMemberForm } from "./create-bulk-member-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const sesssion = await auth();
  if (!sesssion) redirect("/auth/login");
  return (
    <div>
      <CreateBulkMemberForm createdBy={sesssion.user.id} />
    </div>
  );
}
