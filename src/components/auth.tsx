import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/server/actions/auth";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={signOutAction} className="w-full">
      <DropdownMenuItem asChild className="w-full">
        <button>
          <LogOut />
          Sign Out
        </button>
      </DropdownMenuItem>
    </form>
  );
}
