import React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex items-center justify-between px-8 py-3">
        <p>
          <Link href={"/"}>Postren</Link>
        </p>
        <ModeToggle />
      </div>
    </footer>
  );
}
