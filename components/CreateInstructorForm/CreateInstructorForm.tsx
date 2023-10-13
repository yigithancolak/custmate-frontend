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
import { CREATE_INSTRUCTOR_MUTATION } from '@/lib/queries/instructor'
import { createInstructorSchema } from '@/lib/validation/instructor'
import {
  CreateInstructorResponse,
  CreateInstructorVariables
} from '@/types/instructorTypes'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreateItemFormProps } from '../CreateGroupForm/CreateGroupForm'
import { useToast } from '../ui/use-toast'

export function CreateInstructorForm(props: CreateItemFormProps) {
  const [createInstructor, { loading: createInstructorLoading }] = useMutation<
    CreateInstructorResponse,
    CreateInstructorVariables
  >(CREATE_INSTRUCTOR_MUTATION)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof createInstructorSchema>>({
    resolver: zodResolver(createInstructorSchema),
    defaultValues: {
      name: ''
    }
  })

  function onSubmit(values: z.infer<typeof createInstructorSchema>) {
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
