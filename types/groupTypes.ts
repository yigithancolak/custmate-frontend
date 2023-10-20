import { CustomerItem } from './customerTypes'
import { InstructorItem } from './instructorTypes'
import { CreateTimeInput, TimeItem } from './timeTypes'

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
  times: CreateTimeInput[]
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

export type UpdateGroupResponse = {
  updateGroup: string
}

export type UpdateGroupInput = {
  name?: string // The question mark indicates this field is optional.
  instructor?: string
  times?: CreateTimeInput[]
  //intentionally create time input is used because in backend all times of group has been deleted and re created with new values
}

export type UpdateGroupVariables = {
  id: string
  input: UpdateGroupInput
}

export type GetGroupResponse = {
  getGroup: GroupItem
}

export type GetGroupVariables = {
  id: string
}
