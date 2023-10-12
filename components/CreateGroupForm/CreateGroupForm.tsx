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
import { X } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

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

  console.log(form.formState.errors)

  function onSubmit(values: z.infer<typeof createGroupSchema>) {
    console.log(values)
    // createGroup({
    //   variables: {
    //     input: {
    //       name: values.name,
    //       instructor: values.instructorId,
    //       times: values.times
    //     }
    //   },
    //   onCompleted: (data) => {
    //     toast({
    //       description: `Group named ${data.createGroup.name} successfully created`
    //     })
    //   },
    //   onError: (err) => {
    //     toast({
    //       variant: 'destructive',
    //       description: err.message
    //     })
    //   }
    // })
  }

  const addTime = () => {
    append({ day: '', start_hour: '', finish_hour: '' })
  }

  if (loading) {
    return 'loading'
  }

  if (error) {
    return 'error'
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input {...form.register('name')} id="name" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="choose-instructor" className="text-right">
            Choose Instructor
          </Label>
          <Select
            onValueChange={(value) => {
              form.setValue('instructorId', value)
            }}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {/* TODO:DELETE */}
              <SelectItem value="c7fb633e-36a1-42db-8214-91826e73b7a3">
                Ahmet
              </SelectItem>

              {data?.listInstructors.map((instructor) => {
                return (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 py-4">
          {fields.map((_, index) => (
            <div key={index} className="my-4">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor={`day-${index}`} className="text-right">
                  Day
                </Label>
                <X onClick={() => remove(index)} className="cursor-pointer" />
              </div>
              <Input
                {...form.register(`times.${index}.day`)}
                id={`day-${index}`}
                className="col-span-3 w-full mb-2"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`start_hour-${index}`} className="text-right">
                    Start Hour
                  </Label>
                  <Input
                    {...form.register(`times.${index}.start_hour`)}
                    id={`start_hour-${index}`}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor={`finish_hour-${index}`}
                    className="text-right"
                  >
                    Finish Hour
                  </Label>
                  <Input
                    {...form.register(`times.${index}.finish_hour`)}
                    id={`finish_hour-${index}`}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addTime}>
            Add Time
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}
