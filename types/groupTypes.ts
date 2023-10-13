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

export type CreateGroupInput = {
  name: string
  instructor: string
  times: Array<{
    day: string
    start_hour: string
    finish_hour: string
  }>
}

export type CreateGroupMutationResponse = {
  createGroup: GroupItem
}

export type DeleteGroupResponse = {
  deleteGroup: boolean
}

export type DeleteGroupVariables = {
  id: string
}
