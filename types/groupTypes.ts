export type ListGroupsResponse = {
  listGroupsByOrganization: {
    totalCount: number
    items: GroupItem[]
  }
}

export type GroupItem = {
  name: string
  times: GroupTime[]
}

export type GroupTime = {
  day: string
  start_hour: string
  finish_hour: string
}

export type ListGroupsVariables = {
  offset: number
  limit: number
}
