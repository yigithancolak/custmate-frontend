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
import { convertStringToDate } from '@/lib/helpers/dateHelpers'
import { LIST_CUSTOMERS_BY_GROUP } from '@/lib/queries/customer'
import { LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS } from '@/lib/queries/group'
import {
  CREATE_PAYMENT_MUTATION,
  GET_PAYMENT_BY_ID,
  UPDATE_PAYMENT_MUTATION
} from '@/lib/queries/payment'
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
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreateItemFormProps } from '../CreateGroupForm/CreateGroupForm'
import { FormComboboxItem } from '../FormComboboxItem/FormComboboxItem'
import { FormDatePickerItem } from '../FormDatePickerItem/FormDatePickerItem'
import { FormRadioItem } from '../FormRadioItem/FormRadioItem'
import { useToast } from '../ui/use-toast'

export function CreatePaymentForm(props: CreateItemFormProps) {
  const [searchedGroup, setSearchedGroup] = useState('')
  const [searchedCustomer, setSearchedCustomer] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')

  const { toast } = useToast()

  const handleGroupSearchChange = (search: string) => {
    setSearchedGroup(search)
  }

  const hadleCustomerSearchChange = (search: string) => {
    setSearchedCustomer(search)
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const [createPayment, { loading: createPaymentLoading }] = useMutation<
    CreatePaymentResponse,
    { input: CreatePaymentInput }
  >(CREATE_PAYMENT_MUTATION)

  const [updatePayment] = useMutation<
    UpdatePaymentResponse,
    { id: string; input: UpdatePaymentInput }
  >(UPDATE_PAYMENT_MUTATION)

  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS,
    {
      variables: {
        offset: 0,
        limit: 1000
      }
    }
  )

  const { data: custormersOfGroupData } = useQuery<
    ListCustomersByGroupResponse,
    ListCustomersByGroupVariables
  >(LIST_CUSTOMERS_BY_GROUP, {
    variables: {
      limit: 10000,
      offset: 0,
      groupId: selectedGroupId
    },
    skip: !selectedGroupId
  })

  const { loading: getPaymentLoading, error: getPaymentError } = useQuery<
    GetPaymentResponse,
    GetPaymentVariables
  >(GET_PAYMENT_BY_ID, {
    variables: {
      id: props.itemId as string
    },
    skip: props.type === 'create',
    onCompleted: (data) => {
      form.reset({
        amount: String(data.getPayment.amount),
        currency: data.getPayment.currency,
        date: convertStringToDate(data.getPayment.date),
        paymentType: data.getPayment.paymentType
      })
    }
  })

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
          description: `Payment has successfully created Amont: ${
            data.createPayment.amount
          } ${data.createPayment.currency.toUpperCase()}`
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

  onSubmit = (values: z.infer<typeof schema>) => {
    if (props.type === 'create') {
      return onSubmitCreate(values as z.infer<typeof createPaymentSchema>)
    }
    return onSubmitUpdate(values)
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
                <FormComboboxItem
                  field={field}
                  fieldName="groupId"
                  form={form}
                  handleItemSelect={handleGroupSelect}
                  handleSearchTermChange={handleGroupSearchChange}
                  items={groups}
                  searchTerm={searchedGroup}
                />
              )}
            />

            {selectedGroupId && (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormComboboxItem
                    field={field}
                    fieldName="customerId"
                    form={form}
                    handleSearchTermChange={hadleCustomerSearchChange}
                    items={customersOfGroup}
                    searchTerm={searchedCustomer}
                  />
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
