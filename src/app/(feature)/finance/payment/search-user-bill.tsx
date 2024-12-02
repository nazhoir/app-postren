"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchUserByIdentity, searchUserByName } from "@/server/actions/users";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchUserBill() {
  interface User {
    id: string;
    name: string;
  }
  const [user, setUser] = useState<User | undefined>();
  const [name, setName] = useState("");
  const [identiy, setIdentity] = useState("");

  const searchByName = async () => {
    const req = await searchUserByName(name);

    if (req) setUser(req);
  };

  const searchByIdentity = async () => {
    const req = await searchUserByIdentity(identiy);
    if (req) setUser(req);
  };

  const clearResult = () => {
    setUser(undefined);
  };
  const router = useRouter();

  const searchParams = useSearchParams();
  const selectUser = (id: string) => {
    router.push(`/finance/payment?user_id=${id}`);
  };

  const changeTab = (value: string) => {
    router.push(`/finance/payment?tab=${value}`);
  };

  const tab = searchParams.get("tab");
  return (
    <div className="space-y-5">
      <Tabs defaultValue={tab ?? "name"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="name" onClick={() => changeTab("name")}>
            Cari berdasarkan Nama
          </TabsTrigger>
          <TabsTrigger value="identity" onClick={() => changeTab("identity")}>
            Cari berdasarkan NIK/ID
          </TabsTrigger>
        </TabsList>
        <TabsContent value="name">
          <Card>
            <CardHeader>
              <div className="space-y-1">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => searchByName()}>
                Cari
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <div className="space-y-1">
                <Label htmlFor="identity">NIK/ID</Label>
                <Input
                  id="identity"
                  onChange={(e) => setIdentity(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => searchByIdentity()}>
                Cari
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {user && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{user.name}</CardTitle>

            <div className="flex space-x-2">
              <Button
                size={"sm"}
                className="bg-red-600 hover:bg-red-700"
                onClick={() => clearResult()}
              >
                Batal
              </Button>
              <Button size={"sm"} onClick={() => selectUser(user.id)}>
                Pilih
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
