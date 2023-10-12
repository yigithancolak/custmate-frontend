import { CustomerItem } from './customerTypes'
import { InstructorItem } from './instructorTypes'
import { TimeItem } from './timeTypes'

export type ListGroupsResponse = {
  listGroupsByOrganization: {
    totalCount: number
    items: GroupItem[]
  }
}

export type GroupItem = {
  id: string
  name: string
  instructor: InstructorItem
  times: TimeItem[]
  customers: CustomerItem[]
}

export type ListGroupsVariables = {
  offset: number
  limit: number
}
