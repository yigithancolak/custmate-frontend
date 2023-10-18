export type OrganizationItem = {
  id: string
  name: string
  email: string
}

export type GetOrganizationResponse = {
  getOrganization: OrganizationItem
}
