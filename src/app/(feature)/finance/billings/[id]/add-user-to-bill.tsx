"use client";
import { Button } from "@/components/ui/button";
import { addUserToBill } from "@/server/actions/users";
import React from "react";
import { toast } from "sonner";

export default function AddUserToBill({
  billId,
  userId,
}: {
  billId: string;
  userId: string;
}) {
  return (
    <Button
      onClick={async () => {
        const req = await addUserToBill(userId, billId);

        if (req) {
          toast.success("Created");
        }
      }}
    >
      Tambah
    </Button>
  );
}
