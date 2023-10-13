'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CREATE_GROUP_MUTATION } from '@/lib/queries/group'
import { LIST_INSTRUCTORS_QUERY } from '@/lib/queries/instructor'
import { createGroupSchema } from '@/lib/validation/group'
import {
  CreateGroupInput,
  CreateGroupMutationResponse
} from '@/types/groupTypes'
import {
  ListInstructorsResponse,
  ListInstructorsVariables
} from '@/types/instructorTypes'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock3, Plus, Save, X } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { toast } from '../ui/use-toast'

export function CreateGroupForm() {
  const { data, loading, error } = useQuery<
    ListInstructorsResponse,
    ListInstructorsVariables
  >(LIST_INSTRUCTORS_QUERY, {
    variables: {
      offset: 0,
      limit: 100
    }
  })

  const [createGroup, { loading: createGroupLoading }] = useMutation<
    CreateGroupMutationResponse,
    { input: CreateGroupInput }
  >(CREATE_GROUP_MUTATION)

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

  //   console.log(form.formState.errors)

  function onSubmit(values: z.infer<typeof createGroupSchema>) {
    // console.log(values)
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
          description: `Group named ${data.createGroup.name} successfully created`
        })
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

  if (loading) {
    return <p>Loading</p>
  }

  if (error) {
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
                  <FormLabel htmlFor="group-name">Name</FormLabel>
                  <FormControl>
                    <Input {...field} id="group-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* INSTRUCTOR FIELD */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="instructorId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="group-instructor">
                    Choose instructor
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="group-instructor">
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO:DELETE */}
                        <SelectItem value="c7fb633e-36a1-42db-8214-91826e73b7a3">
                          Ahmet
                        </SelectItem>

                        {data?.listInstructors.map((instructor) => {
                          return (
                            <SelectItem
                              key={instructor.id}
                              value={instructor.id}
                            >
                              {instructor.name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* TIMES FIELDS */}
          <div className="grid gap-4 py-4">
            {fields.map((_, index) => (
              <div key={index} className="my-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-right">Times</Label>
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
                      <FormLabel htmlFor={`day-${index}`}>Day</FormLabel>
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
                            Start Hour
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
                              Must be HH:MM format
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
                            Finish Hour
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
                              Must be HH:MM format
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
            <span>Save</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
