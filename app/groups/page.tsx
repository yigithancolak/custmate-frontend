'use client'
import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { groupColumns } from '@/components/DataTable/columns'
import { DataTable } from '@/components/DataTable/DataTable'
import { LIST_GROUPS_DASHBOARD_QUERY } from '@/lib/queries/group'
import { ListGroupsResponse, ListGroupsVariables } from '@/types/groupTypes'
import { useQuery } from '@apollo/client'

export default function GroupsPage() {
  const { data, loading, error } = useQuery<
    ListGroupsResponse,
    ListGroupsVariables
  >(LIST_GROUPS_DASHBOARD_QUERY, {
    variables: {
      offset: 0,
      limit: 10
    }
  })

  if (error) return <p>Error: {error.message}</p>

  const groups = data?.listGroupsByOrganization.items || []

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Groups Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="groups" />
        <DataTable columns={groupColumns} data={groups} loading={loading} />
      </div>
    </main>
  )
}
