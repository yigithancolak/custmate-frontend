import { format, parse } from 'date-fns'

export const convertStringToDate = (dateString: string): Date => {
  const dateParts = dateString.split('-')
  const year = parseInt(dateParts[0], 10)
  const month = parseInt(dateParts[1], 10) - 1 // Months are 0-indexed
  const day = parseInt(dateParts[2], 10)

  const dateObject = new Date(year, month, day)

  return dateObject
}

export const adjustDateStringFormat = (stringDate: string) => {
  return stringDate.split('T')[0]
}

export function formatTime(timeString: string) {
  const parsedTime = parse(timeString, 'HH:mm:ss', new Date())
  return format(parsedTime, 'HH:mm')
}
