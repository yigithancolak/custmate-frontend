'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LOGIN_MUTATION } from '@/lib/queries/auth'
import { loginSchema } from '@/lib/validation/auth'
import { LoginResponse, LoginVariables } from '@/types/authTypes'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from '../ui/use-toast'

export function LoginForm() {
  const [login, { loading }] = useMutation<LoginResponse, LoginVariables>(
    LOGIN_MUTATION
  )

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login({
      variables: {
        email: values.email,
        password: values.password
      },
      onCompleted: (data) => {
        localStorage.setItem('accessToken', data.login.accessToken)
        toast({
          description: 'User Successfully Logged In'
        })
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4" disabled={loading}>
          Sign In
        </Button>
      </form>
    </Form>
  )
}
