import React from "react";
import NavEdit from "./nav";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  return (
    <>
      <NavEdit userId={id} />
      <div className="p-4">{children}</div>
    </>
  );
}
