"use client"
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpSchema } from '@/lib/formschema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const page = () => {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof signUpSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
            <div className='flex flex-col justify-center gap-2 max-w-2xl mx-auto min-h-screen'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-2xl font-bold'>Sign Up</h1>
                    <p className='text-gray-600'>Sign Up to create Credit Account</p>
                </div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 justify-center'>

                        {/* name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* username  */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* email  */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* password  */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit'>Sign Up</Button>
                    </form>

                </FormProvider>

                <div className='flex gap-2 items-center justify-center mt-5'>
                    <p className='text-gray-600'>Already have an account?</p>
                    <Button className='text-blue-500 hover:underline'>
                        <Link href={"/sign-in"}>Sign In</Link>
                    </Button>
                </div>
            </div>
    )
}

export default page