"use client"
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInSchema } from '@/lib/formschema' 
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const page = () => {
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof signInSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
            <div className='flex flex-col justify-center gap-2 max-w-lg mx-auto min-h-screen'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-2xl font-bold'>Log in</h1>
                    <p className='text-gray-600'>Log in to access Account</p>
                </div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 justify-center'>
                        {/* email  */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Email" {...field} />
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
                                        <Input placeholder="Enter Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit'>Log In</Button>
                    </form>

                </FormProvider>

                <div className='flex gap-1 items-center justify-center mt-5'>
                    <p className='text-gray-600'>Do not have an account?</p>
                    <Button variant={"link"} className='text-blue-500 hover:underline'>
                        <Link href={"/sign-up"}>Sign Up</Link>
                    </Button>
                </div>
            </div>
    )
}

export default page