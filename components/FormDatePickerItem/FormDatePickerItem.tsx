'use client'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { PopoverContent } from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { ControllerRenderProps } from 'react-hook-form'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverTrigger } from '../ui/popover'

interface FormDatePickerItemProps<
  K extends 'nextPayment' | 'lastPayment' | 'date' | 'nextPaymentDate'
> {
  field: ControllerRenderProps<any, K>
  label: string
}

export function FormDatePickerItem<
  K extends 'nextPayment' | 'lastPayment' | 'date' | 'nextPaymentDate'
>(props: FormDatePickerItemProps<K>) {
  const { field, label } = props
  return (
    <FormItem className="w-full">
      <FormLabel className="mr-3">{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] text-left font-normal',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? (
                format(field.value, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background"
          align="start"
          side="top"
        >
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              field.name === 'nextPayment' || field.name === 'nextPaymentDate'
                ? date < new Date()
                : date < new Date('1900-01-01')
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )
}
