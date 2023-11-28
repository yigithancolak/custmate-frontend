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
import { useAuth } from '@/providers/AuthProvider'
import { LoginResponse, LoginVariables } from '@/types/authTypes'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card } from '../ui/card'
import { useToast } from '../ui/use-toast'

export function AuthForm() {
  const t = useTranslations('AuthPage')
  const [login, { loading }] = useMutation<LoginResponse, LoginVariables>(
    LOGIN_MUTATION,
    {
      context: { skipAuth: true }
    }
  )

  const { toast } = useToast()
  const { login: setLogin } = useAuth()

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
        toast({
          description: t('Messages.success')
        })
        setLogin(data.login.accessToken)
      },
      onError: () => {
        toast({
          variant: 'destructive',
          description: t('Messages.error')
        })
      }
    })
  }

  return (
    <Card className="w-4/5 md:w-1/2 p-3">
      <div className="flex justify-center  mb-4">
        <Button className="py-1 px-3 w-1/2 rounded-r-none" variant="outline">
          {t('Sections.login')}
        </Button>
        <Button
          className="py-1 px-3 w-1/2 rounded-l-none"
          disabled
          variant="outline"
        >
          <Lock className="mr-2" />
          {t('Sections.register')}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base">Email</FormLabel>
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
                <FormLabel className="text-base">{t('password')}</FormLabel>
                <FormControl>
                  <Input placeholder="*****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-6 w-full text-lg"
            disabled={loading}
          >
            {t('signin')}
          </Button>
        </form>
      </Form>
    </Card>
  )
}
