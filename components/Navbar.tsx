"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Credit System
        </Link>
        <nav className="flex items-center gap-4">
          {status === "loading" ? (
            <div>Loading...</div>
          ) : session ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/transactions">Transactions</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut({ redirect: false }); // Sign out without redirect
                  window.location.reload(); // Refresh the page to update the UI
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/log-in">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
