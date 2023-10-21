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
import {
  CREATE_INSTRUCTOR_MUTATION,
  GET_INSTRUCTOR_BY_ID,
  UPDATE_INSTRUCTOR_MUTATION
} from '@/lib/queries/instructor'
import { createInstructorSchema } from '@/lib/validation/instructor'
import {
  CreateInstructorResponse,
  CreateInstructorVariables,
  GetInstructorResponse,
  GetInstructorVariables,
  UpdateInstructorInput,
  UpdateInstructorResponse
} from '@/types/instructorTypes'
import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreateItemFormProps } from '../CreateGroupForm/CreateGroupForm'
import { FormModalLoading } from '../FormModalLoading/FormModalLoading'
import { useToast } from '../ui/use-toast'

export function CreateInstructorForm(props: CreateItemFormProps) {
  const { toast } = useToast()
  const [createInstructor, { loading: createInstructorLoading }] = useMutation<
    CreateInstructorResponse,
    CreateInstructorVariables
  >(CREATE_INSTRUCTOR_MUTATION)

  const [updateInstructor] = useMutation<
    UpdateInstructorResponse,
    { id: string; input: UpdateInstructorInput }
  >(UPDATE_INSTRUCTOR_MUTATION)

  const {
    data: getInstructorData,
    loading: getInstructorLoading,
    error: getInstructorError
  } = useQuery<GetInstructorResponse, GetInstructorVariables>(
    GET_INSTRUCTOR_BY_ID,
    {
      skip: props.type === 'create',
      variables: {
        id: props.itemId as string
      }
    }
  )

  const form = useForm<z.infer<typeof createInstructorSchema>>({
    resolver: zodResolver(createInstructorSchema),
    defaultValues: {
      name: ''
    }
  })

  useEffect(() => {
    if (getInstructorData?.getInstructor && props.type === 'update') {
      form.reset({
        name: getInstructorData.getInstructor.name
      })
    }
  }, [getInstructorData])

  function onSubmitCreate(values: z.infer<typeof createInstructorSchema>) {
    createInstructor({
      variables: {
        input: {
          name: values.name
        }
      },
      onCompleted: (data) => {
        toast({
          description: `Instructor named ${data.createInstructor.name} has successfully created`
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

  function onSubmitUpdate(values: z.infer<typeof createInstructorSchema>) {
    updateInstructor({
      variables: {
        id: props.itemId as string,
        input: {
          name: values.name
        }
      },
      onCompleted: (data) => {
        toast({
          description: data.updateInstructor
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

  let onSubmit: (values: z.infer<typeof createInstructorSchema>) => void

  onSubmit = (values: z.infer<typeof createInstructorSchema>) => {
    if (props.type === 'create') {
      return onSubmitCreate(values)
    }
    return onSubmitUpdate(values)
  }

  if (getInstructorLoading) {
    return <FormModalLoading fieldCount={1} />
  }

  if (getInstructorError) {
    return <p>Error</p>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of instructor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createInstructorLoading}
          className="mt-3"
        >
          <Save className="mr-2" />
          <span>Save</span>
        </Button>
      </form>
    </Form>
  )
}
