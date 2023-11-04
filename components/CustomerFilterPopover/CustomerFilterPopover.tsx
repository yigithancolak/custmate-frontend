'use client'
import { searchCustomerFilterSchema } from '@/lib/validation/customer'
import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface CustomerFilterPopoverProps {
  handleFilterChange: (
    values: z.infer<typeof searchCustomerFilterSchema>
  ) => void
}

export function CustomerFilterPopover(props: CustomerFilterPopoverProps) {
  const t = useTranslations('Components.CustomerFilterPopover')

  const form = useForm<z.infer<typeof searchCustomerFilterSchema>>({
    resolver: zodResolver(searchCustomerFilterSchema),
    defaultValues: {
      name: '',
      phoneNumber: ''
    }
  })

  return (
    <Popover>
      <PopoverTrigger>
        <Filter />
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(props.handleFilterChange)}
            className="flex w-full flex-col items-center gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t('phoneNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latePayment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">{t('latePayments')}</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="upcomingPayment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">
                    {t('upcomingPayments')}
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-3">
              <Search className="mr-2" />
              <span>Search</span>
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
