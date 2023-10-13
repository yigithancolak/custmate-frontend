import { GroupItem } from './groupTypes'

export type InstructorItem = {
  id: string
  name: string
  organizationId: string
  groups: GroupItem[]
}

export type ListInstructorsResponse = {
  listInstructors: InstructorItem[]
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
