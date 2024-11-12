import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main className="container mx-auto flex min-h-screen items-center justify-center px-8 py-20">
        <Button className="w-full lg:w-32" asChild>
          <Link href={"/auth/login"}>Login</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
