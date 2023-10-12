import { GroupItem } from './groupTypes'

export type InstructorItem = {
  id: string
  name: string
  organizationId: string
  groups: GroupItem[]
}
