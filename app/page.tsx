import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  return (
    <main className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3">
        <h1 className="text-2xl font-bold">Welcome to Credit System</h1>
        <p className="text-gray-700 text-lg">
          Manage your credit transactions with ease
        </p>

        {session ? (
          <>
            <p className="text-lg flex gap-1">
              Check current balance :
              <Button variant="link" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </p>
            <Button asChild>
              <Link href="/transactions">View Transactions</Link>
            </Button>
          </>
        ) : (
          <>
            <p className="">
              Get $25 credit bonus when you sign up!
            </p>
            <Button>
              <Link href="/log-in">Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </main>
  )
}