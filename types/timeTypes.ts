export type TimeItem = {
  id: string
  groupId: string
  day: string
  start_hour: string
  finish_hour: string
}

// export type UpdateTimeInput = {
//   day?: string // The question mark indicates this field is optional.
//   start_hour?: string
//   finish_hour?: string
// }

export type CreateTimeInput = {
  day: string
  start_hour: string
  finish_hour: string
}
