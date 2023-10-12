'use client'

export default function PaymentsPage() {
  //   const {
  //     data: groupsData,
  //     loading: groupsLoading,
  //     error: groupsError
  //   } = useQuery<ListGroupsResponse, ListGroupsVariables>(
  //     LIST_GROUPS_DASHBOARD_QUERY,
  //     {
  //       variables: {
  //         offset: 0,
  //         limit: 10
  //       }
  //     }
  //   )

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Payments OF ORGANIZATION </h3>
      <div className="flex w-10/12 md:w-8/12 flex-col gap-4 border-2"></div>
    </main>
  )
}
