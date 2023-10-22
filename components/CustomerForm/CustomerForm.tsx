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
import {
  CREATE_CUSTOMER_MUTATION,
  GET_CUSTOMER_BY_ID,
  UPDATE_CUSTOMER_MUTATION
} from '@/lib/queries/customer'
import { LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS } from '@/lib/queries/group'
import {
  createCustomerSchema,
  updateCustomerSchema
} from '@/lib/validation/customer'
import {
  CreateCustomerInput,
  CreateCustomerResponse,
  GetCustomerResponse,
  GetCustomerVariables,
  UpdateCustomerResponse,
  UpdateCustomerVariables
} from '@/types/customerTypes'
import {
  GroupItem,
  ListGroupsResponse,
  ListGroupsVariables
} from '@/types/groupTypes'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Plus, Save, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ModalFormProps } from '../CreateUpdateItemModal/CreateUpdateItemModal'
import { FormComboboxItem } from '../FormComboboxItem/FormComboboxItem'
import { FormDatePickerItem } from '../FormDatePickerItem/FormDatePickerItem'
import { FormModalLoading } from '../FormModalLoading/FormModalLoading'
import { ItemIcon } from '../ItemIcon/DashboardCardIcon'
import { DialogFooter } from '../ui/dialog'
import { useToast } from '../ui/use-toast'

export function CustomerForm(props: ModalFormProps) {
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

  const removeGroupField = (idx: number) => {
    //Remove value from form
    const previousGroups = form.getValues().groups
    const newGroups = previousGroups.filter((_, i) => i !== idx)
    form.setValue('groups', newGroups)

    //Decrease field count
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
      },
      onCompleted: (data) => {
        setGroups(data.listGroupsByOrganization.items)
      }
    }
  )

  const {
    data: getCustomerData,
    loading: getCustomerLoading,
    error: getCustomerError
  } = useQuery<GetCustomerResponse, GetCustomerVariables>(GET_CUSTOMER_BY_ID, {
    skip: props.type === 'create',
    variables: {
      id: props.itemId as string
    },
    onCompleted: (data) => {
      setGroupFieldCount(data.getCustomer.groups.length)
      form.reset({
        name: data.getCustomer.name,
        groups: data.getCustomer.groups.map((g) => g.id),
        lastPayment: convertStringToDate(data.getCustomer.lastPayment),
        nextPayment: convertStringToDate(data.getCustomer.nextPayment),
        phoneNumber: data.getCustomer.phoneNumber
      })
    }
  })

  const [createCustomer, { loading: createCustomerLoading }] = useMutation<
    CreateCustomerResponse,
    { input: CreateCustomerInput }
  >(CREATE_CUSTOMER_MUTATION)

  const [updateCustomer] = useMutation<
    UpdateCustomerResponse,
    UpdateCustomerVariables
  >(UPDATE_CUSTOMER_MUTATION)

  const schema =
    props.type === 'create' ? createCustomerSchema : updateCustomerSchema

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      groups: [] as string[],
      lastPayment: new Date(),
      nextPayment: new Date(),
      phoneNumber: ''
    }
  })

  function onSubmitCreate(values: z.infer<typeof createCustomerSchema>) {
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

  function onSubmitUpdate(values: z.infer<typeof updateCustomerSchema>) {
    updateCustomer({
      variables: {
        id: props.itemId as string,
        input: {
          name: values.name as string,
          groups: values.groups as string[],
          lastPayment: format(values.lastPayment as Date, 'yyyy-MM-dd'),
          nextPayment: format(values.nextPayment as Date, 'yyyy-MM-dd'),
          phoneNumber: values.phoneNumber as string
        }
      },
      onCompleted: (data) => {
        toast({
          description: data.updateCustomer
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

  let onSubmit: (values: z.infer<typeof schema>) => void

  onSubmit = (values: z.infer<typeof schema>) => {
    if (props.type === 'create') {
      return onSubmitCreate(values as z.infer<typeof createCustomerSchema>)
    }
    return onSubmitUpdate(values)
  }

  if (groupsLoading || getCustomerLoading) {
    return <FormModalLoading fieldCount={5} />
  }

  if (groupsError || getCustomerError) {
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
                  label="Select Group"
                />
              )}
            />
            {idx !== 0 && (
              <X
                onClick={() => removeGroupField(idx)}
                className="cursor-pointer mt-6 mr-6"
              />
            )}
          </div>
        ))}

        <Button type="button" onClick={addGroupField} className="mt-3 w-full">
          <Plus />
          <ItemIcon type="groups" />
        </Button>

        <DialogFooter className="w-full">
          <Button
            type="submit"
            disabled={createCustomerLoading}
            className="mt-3"
          >
            <Save className="mr-2" />
            <span>Save</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
