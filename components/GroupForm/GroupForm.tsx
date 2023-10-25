'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatTime } from '@/lib/helpers/dateHelpers'
import {
  CREATE_GROUP_MUTATION,
  GET_GROUP_BY_ID,
  UPDATE_GROUP_MUTATION
} from '@/lib/queries/group'
import { LIST_INSTRUCTORS_QUERY } from '@/lib/queries/instructor'
import { createGroupSchema } from '@/lib/validation/group'
import {
  CreateGroupInput,
  CreateGroupMutationResponse,
  GetGroupResponse,
  GetGroupVariables,
  UpdateGroupResponse,
  UpdateGroupVariables
} from '@/types/groupTypes'
import {
  InstructorItem,
  ListInstructorsResponse,
  ListInstructorsVariables
} from '@/types/instructorTypes'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock3, Plus, Save, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ModalFormProps } from '../CreateUpdateItemModal/CreateUpdateItemModal'
import { FormComboboxItem } from '../FormComboboxItem/FormComboboxItem'
import { FormModalLoading } from '../FormModalLoading/FormModalLoading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { useToast } from '../ui/use-toast'

export function GroupForm(props: ModalFormProps) {
  const [instructors, setInstructors] = useState<InstructorItem[]>([])
  const [searchedInstructor, setSearchedInstructor] = useState('')

  const t = useTranslations('Components.CreateUpdateForms.Group')
  const { toast } = useToast()

  const handleInstructorSearchChange = (search: string) => {
    setSearchedInstructor(search)
  }

  const { loading: getGroupLoading, error: getGroupError } = useQuery<
    GetGroupResponse,
    GetGroupVariables
  >(GET_GROUP_BY_ID, {
    variables: {
      id: props.itemId as string
    },
    skip: props.type === 'create',
    onCompleted: (data) => {
      form.reset({
        instructorId: data.getGroup.instructor.id,
        name: data.getGroup.name,
        times: data.getGroup.times.map((t) => ({
          ...t,
          finish_hour: formatTime(t.finish_hour),
          start_hour: formatTime(t.start_hour)
        }))
      })
    }
  })

  useQuery<ListInstructorsResponse, ListInstructorsVariables>(
    LIST_INSTRUCTORS_QUERY,
    {
      onCompleted(data) {
        setInstructors(data.listInstructors.items)
      }
    }
  )

  const [createGroup, { loading: createGroupLoading }] = useMutation<
    CreateGroupMutationResponse,
    { input: CreateGroupInput }
  >(CREATE_GROUP_MUTATION)

  const [updateGroup] = useMutation<UpdateGroupResponse, UpdateGroupVariables>(
    UPDATE_GROUP_MUTATION
  )

  const form = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      instructorId: '',
      times: [{ day: '', start_hour: '', finish_hour: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'times'
  })

  function onSubmitCreate(values: z.infer<typeof createGroupSchema>) {
    createGroup({
      variables: {
        input: {
          name: values.name,
          instructor: values.instructorId,
          times: values.times
        }
      },
      onCompleted: (data) => {
        toast({
          description: t('createdMessage', { name: data.createGroup.name })
        })
        props.closeFormModal()
        props.refetch()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  function onSubmitUpdate(values: z.infer<typeof createGroupSchema>) {
    updateGroup({
      variables: {
        id: props.itemId as string,
        input: {
          name: values.name,
          instructor: values.instructorId,
          times: values.times
        }
      },
      onCompleted: (data) => {
        toast({
          description: t('updatedMessage')
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

  const addTime = () => {
    append({ day: '', start_hour: '', finish_hour: '' })
  }

  let onSubmit: (values: z.infer<typeof createGroupSchema>) => void

  onSubmit = (values) => {
    if (props.type === 'create') {
      return onSubmitCreate(values)
    }
    return onSubmitUpdate(values)
  }

  if (getGroupLoading) {
    return <FormModalLoading fieldCount={5} />
  }

  if (getGroupError) {
    return <p>Error</p>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-4">
          {/* NAME FIELD */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="group-name">{t('Labels.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} id="group-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* INSTRUCTOR FIELD */}
          <div className="flex w-full">
            <FormField
              control={form.control}
              name="instructorId"
              render={({ field }) => (
                <FormComboboxItem
                  field={field}
                  fieldName="instructorId"
                  form={form}
                  handleSearchTermChange={handleInstructorSearchChange}
                  items={instructors}
                  label={t('Labels.instructor')}
                  searchTerm={searchedInstructor}
                />
              )}
            />
          </div>

          {/* TIMES FIELDS */}
          <div className="grid gap-4 py-4">
            {fields.map((_, index) => (
              <div key={index} className="my-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-right">{t('Labels.times')}</Label>
                  {index !== 0 && (
                    <X
                      onClick={() => remove(index)}
                      className="cursor-pointer"
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`times.${index}.day`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor={`day-${index}`}>
                        {t('Labels.day')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={`day-${index}`}
                          className="col-span-3 w-full mb-2"
                        />
                      </FormControl>
                      {form.getFieldState(`times.${index}.start_hour`)
                        .error && (
                        <p className="text-sm font-semibold text-red-500">
                          Invalid day
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name={`times.${index}.start_hour`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel htmlFor={`start-hour-${index}`}>
                            {t('Labels.startHour')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id={`start-hour-${index}`}
                              className="w-full"
                            />
                          </FormControl>
                          {form.getFieldState(`times.${index}.start_hour`)
                            .error && (
                            <p className="text-sm font-semibold text-red-500">
                              {t('Errors.timeFormat')}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name={`times.${index}.finish_hour`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel htmlFor={`finish_hour-${index}`}>
                            {t('Labels.finishHour')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id={`finish_hour-${index}`}
                              className="w-full"
                            />
                          </FormControl>
                          {form.getFieldState(`times.${index}.finish_hour`)
                            .error && (
                            <p className="text-sm font-semibold text-red-500">
                              {t('Errors.timeFormat')}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addTime}>
              <Plus />
              <Clock3 />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={createGroupLoading}>
            <Save className="mr-2" />
            <span>{t('save')}</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
