"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

// Types

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

// Fetch Function
const fetchTransactions = async (): Promise<Transaction[]> => {
  const res = await fetch('/api/transactions/admin')
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

// Reusable Table Component
function TransactionTable({
  title,
  transactions,
  showActions = false,
  onApprove,
  onReject
}: {
  title: string
  transactions: Transaction[]
  showActions?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-sm text-muted-foreground">No transactions found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="font-medium">{tx.userName}</div>
                    <div className="text-sm text-gray-500">{tx.userEmail}</div>
                  </TableCell>
                  <TableCell>{tx.amount} credits</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {tx.description.length > 15 ? `${tx.description.slice(0, 15)}...` : tx.description}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                  {showActions && (
                    <TableCell className="flex gap-2">
                      <Button size="sm" onClick={() => onApprove?.(tx.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => onReject?.(tx.id)}>Reject</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

// Main Component
export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const {
    data: transactions = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: fetchTransactions,
    enabled: session?.user?.role === 'ADMIN',
  })

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) => {
      const res = await fetch(`/api/transactions/admin/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update transaction')
      return { id, status }
    },
    onSuccess: (_, { id, status }) => {
      queryClient.setQueryData<Transaction[]>(['admin-transactions'], (old) =>
        old?.map(tx =>
          tx.id === id ? { ...tx, status, processedAt: new Date().toISOString() } : tx
        ) || []
      )
      toast.success(`Transaction ${status.toLowerCase()}`)
    },
    onError: () => toast.error('Failed to update transaction')
  })

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
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading transactions</div>
      ) : (
        <>
          <TransactionTable
            title="Pending Transactions"
            transactions={transactions.filter(tx => tx.status === 'PENDING')}
            showActions
            onApprove={(id) => mutation.mutate({ id, status: 'APPROVED' })}
            onReject={(id) => mutation.mutate({ id, status: 'REJECTED' })}
          />
          <TransactionTable
            title="Approved Transactions"
            transactions={transactions.filter(tx => tx.status === 'APPROVED')}
          />
          <TransactionTable
            title="Rejected Transactions"
            transactions={transactions.filter(tx => tx.status === 'REJECTED')}
          />
        </>
      )}
    </div>
  )
}
