"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface UserData {
    name: string
    email: string
    username?: string
    creditBalance?: number
    role: 'USER' | 'ADMIN'
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const [userData, setUserData] = useState<UserData | null>(null)

    if (!session) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please sign in to view your profile.</p>
                        <Button asChild className="mt-4">
                            <Link href="/log-in">Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        if (!session) return

        const fetchUserData = async () => {
            const res = await fetch("/api/user")

            if (!res.ok) throw new Error('Failed to fetch user data')

            const data = await res.json()
            setUserData(data);
        }
        fetchUserData();
    }, [])

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium">Name</h3>
                        <p>{userData?.name}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Email</h3>
                        <p>{userData?.email}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Username</h3>
                        <p>{userData?.username || 'Not set'}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Credit Balance</h3>
                        <p>{userData?.creditBalance || 0} credits</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Role</h3>
                        <p>{userData?.role}</p>
                    </div>
                    {userData?.role === 'ADMIN' && (
                        <Button asChild variant="outline">
                            <Link href="/admin/dashboard">Admin Dashboard</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}