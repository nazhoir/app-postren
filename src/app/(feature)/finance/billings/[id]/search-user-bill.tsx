"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getUserProfile } from "@/server/actions/users";
import React, { useState } from "react";
import AddUserToBill from "./add-user-to-bill";

export default function SearchUser({ billId }: { billId: string }) {
  interface User {
    id: string;
    name: string;
  }
  const [user, setUser] = useState<User | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<undefined | string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      console.error("Input is empty");
      return;
    }
    try {
      const req = (await getUserProfile(input)) as User | undefined;
      if (!req) {
        setError("User not found");
        setUser(undefined);
        return;
      }
      setError(undefined);
      setUser({
        name: req.name,
        id: req.id,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      setError(`Error fetching user profile: ${error}`);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Tambah Tertagih</h2>
      <form
        method="get"
        className="mt-4 flex space-x-2"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Masukkan user id"
          type="search"
          name="id"
          id="id"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <Button type="submit" className="w-32" disabled={!input.trim()}>
          Cari
        </Button>
      </form>

      {/* Displaying feedback */}
      {user && (
        <Card className="mt-4">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{user.name}</CardTitle>
            <AddUserToBill userId={user.id} billId={billId} />
          </CardHeader>
        </Card>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
