import { auth } from "@/auth"
import { db } from "@/database/db"
import { transactions, users } from "@/database/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

// POST: Create transaction

export async function POST(req: Request){
  const session = await auth();

  if(!session?.user?.id){
    return NextResponse.json({error: "unauthorized"}, {status: 401})
  }

  const {amount, description} = await req.json();

  try {
    const tx =  await db.insert(transactions).values({
      userId: session.user.id,
      amount,
      description,
      status: "PENDING"
    }).returning()

    return NextResponse.json(tx[0])
  } catch (error) {
    return NextResponse.json({error:"Failed to create Transaction"}, {status: 500})
  }
}

// GET: List transactions
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // const isAdmin = session.user.role === 'ADMIN';
    
    // // For admin: get all transactions with user info
    // if (isAdmin) {
    //   const allTransactions = await db.query.transactions.findMany({
    //     with: {
    //       user: {
    //         columns: {
    //           name: true,
    //           email: true
    //         }
    //       }
    //     },
    //     orderBy: (transactions, { desc }) => [desc(transactions.createdAt)]
    //   });
    //   return NextResponse.json(allTransactions);
    // }

    // For regular users: get only their transactions
    
    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, session.user.id),
      // orderBy: (transactions, { desc }) => [desc(transactions.createdAt)]
      orderBy: (transactions, {desc}) => [desc(transactions.createdAt)]
    });

    return NextResponse.json(userTransactions);

  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to load transactions' },
      { status: 500 }
    );
  }
}