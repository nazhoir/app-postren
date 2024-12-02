"use client";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchSavingAccount } from "@/server/actions/saving";
import { searchUserByIdentity, searchUserByName } from "@/server/actions/users";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
}

export function SearchUserSavingAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchUser = async (type: "name" | "identity") => {
    // Validasi input sebelum pencarian
    if (type === "name" && !name.trim()) {
      toast.error("Masukkan nama terlebih dahulu");
      return;
    }

    if (type === "identity" && !identity.trim()) {
      toast.error("Masukkan NIK/ID terlebih dahulu");
      return;
    }

    setUser(null);
    setIsLoading(true);

    try {
      const req =
        type === "identity"
          ? await searchUserByIdentity(identity.trim())
          : await searchUserByName(name.trim());

      if (req) {
        const sv = await searchSavingAccount(req.id);

        if (sv) {
          toast.success("Pengguna ditemukan");
          setUser(req);
        } else {
          toast.error("Akun tabungan pengguna tidak ditemukan");
        }
      } else {
        toast.error("Pengguna tidak ditemukan atau belum terdaftar");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      toast.error("Terjadi kesalahan dalam pencarian pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setUser(null);
  };

  const selectUser = (id: string) => {
    router.push(`/savings/cashflow?user_id=${id}`);
  };

  const changeTab = (value: string) => {
    router.push(`/savings/cashflow?tab=${value}`);
  };

  const tab = searchParams.get("tab") ?? "name";

  return (
    <div className="space-y-5">
      <Tabs defaultValue={tab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="name" onClick={() => changeTab("name")}>
            Cari berdasarkan Nama
          </TabsTrigger>
          <TabsTrigger value="identity" onClick={() => changeTab("identity")}>
            Cari berdasarkan NIK/ID
          </TabsTrigger>
        </TabsList>
        <TabsContent value="name">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await searchUser("name");
            }}
          >
            <Card>
              <CardHeader>
                <div className="space-y-1">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardHeader>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Mencari..." : "Cari"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="identity">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await searchUser("identity");
            }}
          >
            <Card>
              <CardHeader>
                <div className="space-y-1">
                  <Label htmlFor="identity">NIK/ID</Label>
                  <Input
                    id="identity"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardHeader>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Mencari..." : "Cari"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>

      {user && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{user.name}</CardTitle>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={clearResult}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => selectUser(user.id)}
                disabled={isLoading}
              >
                Pilih
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
