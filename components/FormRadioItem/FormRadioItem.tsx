'use client'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { ControllerRenderProps } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

interface FormRadioItemProps<K extends 'currency' | 'paymentType'> {
  field: ControllerRenderProps<any, K>
  array: any[]
}

export function FormRadioItem<K extends 'currency' | 'paymentType'>(
  props: FormRadioItemProps<K>
) {
  return (
    <FormItem className="space-y-3 w-full">
      <FormLabel>Currency</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={props.field.onChange}
          defaultValue={props.field.value}
          className="flex space-y-1"
        >
          {props.array.map((item: string, i) => {
            return (
              <FormItem
                key={i}
                className="flex items-center justify-start space-x-3 space-y-0 w-full"
              >
                <FormControl>
                  <RadioGroupItem value={item} />
                </FormControl>
                <FormLabel className="font-normal">
                  {item.includes('_')
                    ? item.replace('_', ' ').toUpperCase()
                    : item.toUpperCase()}
                </FormLabel>
              </FormItem>
            )
          })}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
