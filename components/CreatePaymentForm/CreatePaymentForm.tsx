'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { convertStringToDate } from '@/lib/helpers/dateHelpers'
import { LIST_CUSTOMERS_BY_GROUP } from '@/lib/queries/customer'
import { LIST_GROUPS_BY_ORGANIZATION } from '@/lib/queries/group'
import {
  CREATE_PAYMENT_MUTATION,
  GET_PAYMENT_BY_ID,
  UPDATE_PAYMENT_MUTATION
} from '@/lib/queries/payment'
import { cn } from '@/lib/utils'
import {
  createPaymentSchema,
  updatePaymentSchema
} from '@/lib/validation/payment'
import {
  ListCustomersByGroupResponse,
  ListCustomersByGroupVariables
} from '@/types/customerTypes'
import { ListGroupsResponse, ListGroupsVariables } from '@/types/groupTypes'
import {
  CreatePaymentInput,
  CreatePaymentResponse,
  Currency,
  GetPaymentResponse,
  GetPaymentVariables,
  PaymentType,
  UpdatePaymentInput,
  UpdatePaymentResponse
} from '@/types/paymentTypes'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Check, ChevronsUpDown, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreateItemFormProps } from '../CreateGroupForm/CreateGroupForm'
import { FormDatePickerItem } from '../FormDatePickerItem/FormDatePickerItem'
import { FormRadioItem } from '../FormRadioItem/FormRadioItem'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useToast } from '../ui/use-toast'

export function CreatePaymentForm(props: CreateItemFormProps) {
  const [searchedGroup, setSearchedGroup] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')

  const [formDefaultValues, setFormDefaultValues] = useState({
    amount: '0',
    currency: Currency.TRY,
    date: new Date(),
    paymentType: PaymentType.CASH
  })
  const { toast } = useToast()

  const [createPayment, { loading: createPaymentLoading }] = useMutation<
    CreatePaymentResponse,
    { input: CreatePaymentInput }
  >(CREATE_PAYMENT_MUTATION)

  const [
    updatePayment,
    {
      data: updatePaymentData,
      loading: updatePaymentLoading,
      error: updatePaymentError
    }
  ] = useMutation<
    UpdatePaymentResponse,
    { id: string; input: UpdatePaymentInput }
  >(UPDATE_PAYMENT_MUTATION)

  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION,
    {
      variables: {
        offset: 0,
        limit: 1000
      }
    }
  )

  const [
    getCustomersOfGroups,
    {
      data: custormersOfGroupData,
      loading: custormersOfGroupLoading,
      error: custormersOfGroupError
    }
  ] = useLazyQuery<ListCustomersByGroupResponse, ListCustomersByGroupVariables>(
    LIST_CUSTOMERS_BY_GROUP,
    {
      variables: {
        limit: 10000,
        offset: 0,
        groupId: selectedGroupId
      }
    }
  )

  const {
    loading: getPaymentLoading,
    error: getPaymentError,
    data: getPaymentData,
    refetch: getPaymentRefetch
  } = useQuery<GetPaymentResponse, GetPaymentVariables>(GET_PAYMENT_BY_ID, {
    variables: {
      id: props.itemId as string
    },
    skip: props.type === 'create'
  })

  useEffect(() => {
    if (getPaymentData?.getPayment && props.type === 'update') {
      form.reset({
        amount: String(getPaymentData.getPayment.amount),
        currency: getPaymentData.getPayment.currency,
        date: convertStringToDate(getPaymentData.getPayment.date),
        paymentType: getPaymentData.getPayment.paymentType
      })
    }
  }, [getPaymentData])

  const schema =
    props.type === 'create' ? createPaymentSchema : updatePaymentSchema

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:
      props.type === 'create'
        ? {
            amount: '0',
            currency: Currency.TRY,
            customerId: '',
            date: new Date(),
            groupId: '',
            nextPaymentDate: new Date(),
            paymentType: PaymentType.CASH
          }
        : {
            amount: '0',
            currency: Currency.TRY,
            date: new Date(),
            paymentType: PaymentType.CASH
          }
  })

  function onSubmitCreate(values: z.infer<typeof createPaymentSchema>) {
    createPayment({
      variables: {
        input: {
          amount: Number(values.amount),
          currency: values.currency,
          customerId: values.customerId,
          groupId: values.groupId,
          date: format(values.date, 'yyyy-MM-dd'),
          nextPaymentDate: format(values.nextPaymentDate, 'yyyy-MM-dd'),
          paymentType: values.paymentType
        }
      },
      onCompleted: (data) => {
        toast({
          description: `Payment has successfully created Amont: ${data.createPayment.amount} ${data.createPayment.currency.toUpperCase}`
        })
        props.refetch()
        props.closeFormModal()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  function onSubmitUpdate(values: z.infer<typeof updatePaymentSchema>) {
    updatePayment({
      variables: {
        id: props.itemId || '',
        input: {
          amount: Number(values.amount),
          currency: values.currency,
          date: format(values.date as Date, 'yyyy-MM-dd'),
          paymentType: values.paymentType
        }
      },
      onCompleted: (data) => {
        toast({
          description: data.updatePayment
        })
        props.refetch()
        props.closeFormModal()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  const groups = groupsData?.listGroupsByOrganization.items || []
  const customersOfGroup = custormersOfGroupData?.listCustomersByGroup || []

  let onSubmit: (values: z.infer<typeof schema>) => void

  if (props.type === 'create') {
    onSubmit = (values: z.infer<typeof schema>) => {
      return onSubmitCreate(values as z.infer<typeof createPaymentSchema>)
    }
  } else {
    onSubmit = (values: z.infer<typeof schema>) => {
      return onSubmitUpdate(values)
    }
  }

  if (groupsLoading || getPaymentLoading) {
    return <p>Loading</p>
  }

  if (groupsError || getPaymentError) {
    return <p>Error</p>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-1/2"
                  placeholder="Amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormRadioItem field={field} array={Object.values(Currency)} />
          )}
        />

        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormRadioItem field={field} array={Object.values(PaymentType)} />
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormDatePickerItem field={field} label="Payment Date" />
          )}
        />

        {props.type === 'create' && (
          <>
            <FormField
              control={form.control}
              name="nextPaymentDate"
              render={({ field }) => (
                <FormDatePickerItem field={field} label="Next Payment" />
              )}
            />

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full ">
                  <FormLabel>Choose Group</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[240px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? groups.find((g) => g.id === field.value)?.name
                            : 'Select group'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <Input
                          className="w-full"
                          value={searchedGroup}
                          onChange={(e) => setSearchedGroup(e.target.value)}
                          placeholder="Search group..."
                        />
                        <CommandEmpty>No group found.</CommandEmpty>
                        <CommandGroup>
                          {groups.map(
                            (g) =>
                              g.name.toLowerCase().includes(searchedGroup) && (
                                <CommandItem
                                  value={g.id}
                                  key={g.id}
                                  onSelect={() => {
                                    form.setValue('groupId', g.id)
                                    setSelectedGroupId(g.id)
                                    getCustomersOfGroups()
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      g.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {g.name}
                                </CommandItem>
                              )
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedGroupId && (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full ">
                    <FormLabel>Choose Customer</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-[240px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? customersOfGroup.find(
                                  (c) => c.id === field.value
                                )?.name
                              : 'Select customer'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] p-0">
                        <Command>
                          <Input
                            className="w-full"
                            value={searchedGroup}
                            onChange={(e) => setSearchedGroup(e.target.value)}
                            placeholder="Search customer..."
                          />
                          <CommandEmpty>No group found.</CommandEmpty>
                          <CommandGroup>
                            {customersOfGroup.map(
                              (c) =>
                                c.name
                                  .toLowerCase()
                                  .includes(searchedGroup) && (
                                  <CommandItem
                                    value={c.id}
                                    key={c.id}
                                    onSelect={() => {
                                      form.setValue('customerId', c.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        c.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {c.name}
                                  </CommandItem>
                                )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <Button type="submit" disabled={createPaymentLoading} className="mt-3">
          <Save className="mr-2" />
          <span>Save</span>
        </Button>
      </form>
    </Form>
  )
}
