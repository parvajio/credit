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
              <Link href="/profile">
                <Button variant={"link"}>Profile</Button>
              </Link>
            </p>
            <Link href="/transactions">
              <Button>View Transactions</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="">
              Get $25 credit bonus when you sign up!
            </p>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}