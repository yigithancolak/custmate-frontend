import * as z from 'zod'

export const createInstructorSchema = z.object({
  name: z.string().min(2, {
    message: 'Instructor name must be at least 2 characters.'
  })
  // Add other fields if the CreateInstructorInput type has more fields
})
