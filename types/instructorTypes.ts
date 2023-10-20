import { GroupItem } from './groupTypes'

export type InstructorItem = {
  id: string
  name: string
  organizationId: string
  groups: GroupItem[]
}

export type ListInstructorsResponse = {
  listInstructors: {
    items: InstructorItem[]
    totalCount: number
  }
}

export type GetInstructorResponse = {
  getInstructor: InstructorItem
}

export type GetInstructorVariables = {
  id: string
}

export type ListInstructorsVariables = {
  offset: number
  limit: number
}

export type CreateInstructorResponse = {
  createInstructor: {
    name: string
  }
}

export type CreateInstructorVariables = {
  input: {
    name: string
  }
}

export type DeleteInstructorResponse = {
  deleteInstructor: boolean
}

export type DeleteInstructorVariables = {
  id: string
}

export type UpdateInstructorResponse = {
  updateInstructor: string
}

export type UpdateInstructorInput = {
  name: string
}
