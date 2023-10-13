import { z } from 'zod'

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

const timeSchema = z.object({
  day: z.string().refine((value) => daysOfWeek.includes(value.toLowerCase()), {
    message: 'Enter a valid day name',
    path: ['day']
  }),
  start_hour: z.string().refine((value) => timeRegex.test(value), {
    message: 'Start hour must be in HH:MM format',
    path: ['start_hour']
  }),
  finish_hour: z.string().refine((value) => timeRegex.test(value), {
    message: 'Finish hour must be in HH:MM format',
    path: ['finish_hour']
  })
})

export const createGroupSchema = z.object({
  name: z.string().min(2, 'Min length must be 2'),
  instructorId: z.string().uuid('Not valid uuid'),
  times: z.array(timeSchema)
})
