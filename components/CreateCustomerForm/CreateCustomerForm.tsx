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
import { CREATE_CUSTOMER_MUTATION } from '@/lib/queries/customer'
import { LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS } from '@/lib/queries/group'
import { createCustomerSchema } from '@/lib/validation/customer'
import {
  CreateCustomerInput,
  CreateCustomerResponse
} from '@/types/customerTypes'
import {
  GroupItem,
  ListGroupsResponse,
  ListGroupsVariables
} from '@/types/groupTypes'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateItemFormProps } from '../CreateGroupForm/CreateGroupForm'
import { FormComboboxItem } from '../FormComboboxItem/FormComboboxItem'
import { FormDatePickerItem } from '../FormDatePickerItem/FormDatePickerItem'
import { useToast } from '../ui/use-toast'

export function CreateCustomerForm(props: CreateItemFormProps) {
  const [groups, setGroups] = useState<GroupItem[]>([])
  const [searchedGroup, setSearchedGroup] = useState('')
  const [groupFieldCount, setGroupFieldCount] = useState(1)
  const { toast } = useToast()

  const handleGroupSearchChange = (search: string) => {
    setSearchedGroup(search)
  }

  const addGroupField = () => {
    setGroupFieldCount((prevCount) => prevCount + 1)
  }

  const removeGroupField = () => {
    setGroupFieldCount((prevCount) => prevCount - 1)
  }

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

  useEffect(() => {
    if (groupsData?.listGroupsByOrganization.items) {
      setGroups(groupsData.listGroupsByOrganization.items)
    }
  }, [groupsData])

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
            <FormDatePickerItem field={field} label="Last Payment" />
          )}
        />

        <FormField
          control={form.control}
          name="nextPayment"
          render={({ field }) => (
            <FormDatePickerItem field={field} label="Next Payment" />
          )}
        />

        {Array.from({ length: groupFieldCount }).map((_, idx) => (
          <div key={idx} className="flex items-center w-full">
            <FormField
              control={form.control}
              name={`groups.${idx}`}
              render={({ field }) => (
                <FormComboboxItem
                  field={field}
                  fieldName={`groups.${idx}`}
                  form={form}
                  handleSearchTermChange={handleGroupSearchChange}
                  items={groups}
                  searchTerm={searchedGroup}
                />
              )}
            />
            {idx !== 0 && (
              <X
                onClick={() => removeGroupField()}
                className="cursor-pointer mt-6 mr-6"
              />
            )}
          </div>
        ))}

        <Button type="button" onClick={addGroupField} className="mt-3 w-full">
          Add Group
        </Button>

        <Button
          type="submit"
          disabled={createCustomerLoading}
          className="mt-3 w-full"
        >
          <Save className="mr-2" />
          <span>Save</span>
        </Button>
      </form>
    </Form>
  )
}
