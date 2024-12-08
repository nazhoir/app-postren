import { getOrgsIdByUserId } from "@/server/actions/organizations";
import { getOrgUserProfile } from "@/server/actions/users";
import { auth } from "@/server/auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import EditUserForm from "./edit-user-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) return redirect("/auth/login");

  const { id } = await params;
  const orgID = await getOrgsIdByUserId(session.user.id);

  if (!orgID) return redirect("/auth/login");

  const data = await getOrgUserProfile(id, orgID);
  if (!data) return notFound();
  return <EditUserForm data={data} />;
}
