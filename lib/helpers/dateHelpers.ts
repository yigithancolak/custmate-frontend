import {
  endOfMonth,
  endOfYear,
  format,
  parse,
  startOfMonth,
  startOfYear
} from 'date-fns'

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

export const dateToString = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

export function formatTime(timeString: string) {
  const parsedTime = parse(timeString, 'HH:mm:ss', new Date())
  return format(parsedTime, 'HH:mm')
}

export const getFirstDayOfMonth = (): string => {
  const date_today = new Date()
  const firstDayOfMonth = startOfMonth(date_today)

  return dateToString(firstDayOfMonth)
}

export const getLastDayOfMonth = (): string => {
  const date_today = new Date()
  const lastDayOfMonth = endOfMonth(date_today)

  return dateToString(lastDayOfMonth)
}

export const getFirstDayOfYear = (): string => {
  const date_today = new Date()
  const firstDayOfYear = startOfYear(date_today)
  return dateToString(firstDayOfYear)
}

export const getLastDayOfYear = (): string => {
  const date_today = new Date()
  const lastDayOfYear = endOfYear(date_today)

  return dateToString(lastDayOfYear)
}
