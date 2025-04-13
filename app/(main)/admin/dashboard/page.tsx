"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Transaction = {
    id: string
    amount: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
    processedAt: string | null
    description: string
    userName: string
    userEmail: string
}

export default function AdminDashboardPage() {
    const { data: session } = useSession()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user.role !== 'ADMIN') return

        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/transactions/admin')
                if (!res.ok) throw new Error('Failed to fetch transactions')
                const data = await res.json()
                setTransactions(data)
            } catch (error) {
                toast.error('Error loading transactions')
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [session])

    console.log(transactions)

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions/admin/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'APPROVED' }),
            })

            if (!res.ok) throw new Error('Approval failed')

            setTransactions(transactions.map(tx =>
                tx.id === id ? { ...tx, status: 'APPROVED', processedAt: new Date().toISOString() } : tx
            ))
            toast.success("Transaction approved")
        } catch (error) {
            toast.error('Failed to approve transaction')

        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions/admin/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'REJECTED' }),
            })

            if (!res.ok) throw new Error('Rejection failed')

            setTransactions(transactions.map(tx =>
                tx.id === id ? { ...tx, status: 'REJECTED', processedAt: new Date().toISOString() } : tx
            ))
            toast.success('Transaction rejected')
        } catch (error) {
            toast.error('Failed to reject transaction')
        }
    }

    if (session?.user.role !== 'ADMIN') {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        You must be an admin to access this page.
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (

                        // panding
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Starus</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.filter(tx => tx.status === 'PENDING').map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>
                                            {/* {tx.userName} */}
                                            <div className="font-medium">{tx.userName}</div>
                                            <div className="text-sm text-gray-500">{tx.userEmail}</div>
                                        </TableCell>
                                        <TableCell>{tx.amount} credits</TableCell>
                                        <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{tx.description.length > 15 ? ` ${tx.description.slice(0, 15)}... ` : tx.description}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800`}>
                                                {tx.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button size="sm" onClick={() => handleApprove(tx.id)}>Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(tx.id)}>
                                                Reject
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>



                    )}
                </CardContent>
            </Card>
            {/* approved */}
            <Card>
                <CardHeader>
                    <CardTitle>Approved Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (


                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.filter(tx => tx.status === 'APPROVED').map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>
                                            {/* {tx.userName} */}
                                            <div className="font-medium">{tx.userName}</div>
                                            <div className="text-sm text-gray-500">{tx.userEmail}</div>
                                        </TableCell>
                                        <TableCell>{tx.amount} credits</TableCell>
                                        <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{tx.description.length > 15 ? ` ${tx.description.slice(0, 15)}... ` : tx.description}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs bg-green-100 text-green-800`}>
                                                {tx.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>



                    )}
                </CardContent>
            </Card>
        </div>
    )
}