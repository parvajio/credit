import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto ">
      <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3">
        <h1 className="text-2xl font-bold">Welcome to Credit</h1>
        <p className="text-gray-700 text-lg">
          This is a simple application that allows you to transection credit.
        </p>
        <p className="">
          For $25 credit Bonus Sign in Now!!
        </p>
        <Button>
          <Link href={"/signin"}>Sign In</Link>
        </Button>
      </div>
    </main>
  );
}
