'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CREATE_CUSTOMER_MUTATION } from '@/lib/queries/customer'
import { LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS } from '@/lib/queries/group'
import { createCustomerSchema } from '@/lib/validation/customer'
import {
  CreateCustomerInput,
  CreateCustomerResponse
} from '@/types/customerTypes'
import { ListGroupsResponse, ListGroupsVariables } from '@/types/groupTypes'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateItemFormProps } from '../CreateGroupForm/CreateGroupForm'
import { FormDatePickerItem } from '../FormDatePickerItem/FormDatePickerItem'
import { Checkbox } from '../ui/checkbox'
import { useToast } from '../ui/use-toast'

export function CreateCustomerForm(props: CreateItemFormProps) {
  const { toast } = useToast()

  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS,
    {
      variables: {
        offset: 0,
        limit: 100
      }
    }
  )

  const [createCustomer, { loading: createCustomerLoading }] = useMutation<
    CreateCustomerResponse,
    { input: CreateCustomerInput }
  >(CREATE_CUSTOMER_MUTATION)

  const form = useForm({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      groups: [] as string[],
      lastPayment: new Date(),
      nextPayment: new Date(),
      phoneNumber: ''
    }
  })

  function onSubmit(values: z.infer<typeof createCustomerSchema>) {
    createCustomer({
      variables: {
        input: {
          name: values.name,
          groups: values.groups,
          lastPayment: format(values.lastPayment, 'yyyy-MM-dd'),
          nextPayment: format(values.nextPayment, 'yyyy-MM-dd'),
          phoneNumber: values.phoneNumber
        }
      },
      onCompleted: (data) => {
        toast({
          description: `Customer named ${data.createCustomer.name} has successfully created`
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

  if (groupsLoading) {
    return <p>Loading</p>
  }

  if (groupsError) {
    return <p>Error</p>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center py-6 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of Customer" {...field} />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastPayment"
          render={({ field }) => (
            <FormDatePickerItem
              field={field}
              label="Last Payment"
              description="Choose the last payment of customer"
            />
          )}
        />

        <FormField
          control={form.control}
          name="nextPayment"
          render={({ field }) => (
            <FormDatePickerItem
              field={field}
              label="Next Payment"
              description="Choose the next payment of customer"
            />
          )}
        />

        <FormField
          control={form.control}
          name="groups"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Groups</FormLabel>
                <FormDescription>
                  Select the groups for the customer.
                </FormDescription>
              </div>
              {groupsData?.listGroupsByOrganization.items.map((group) => (
                <FormField
                  key={group.id}
                  control={form.control}
                  name="groups"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={group.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(group.id)}
                            onCheckedChange={(checked) => {
                              console.log(field.value)

                              return checked
                                ? field.onChange([...field.value, group.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== group.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {group.name}{' '}
                          {/* Assuming the group object has a name property */}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createCustomerLoading} className="mt-3">
          <Save className="mr-2" />
          <span>Save</span>
        </Button>
      </form>
    </Form>
  )
}
