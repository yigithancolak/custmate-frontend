import { GroupItem } from './groupTypes'

export type EarningItem = {
  group: GroupItem
  try: number
  eur: number
  usd: number
}

export type ListEarningsResponse = {
  listEarningsByOrganization: {
    items: EarningItem[]
    totalCount: number
    totalEarning: EarningItem
  }
}

export type ListEarningsVariables = {
  startDate: string
  endDate: string
  offset?: number
  limit?: number
}
