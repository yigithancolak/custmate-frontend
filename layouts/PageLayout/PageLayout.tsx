import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Dispatch, SetStateAction } from 'react'

export type ItemType =
  | 'groups'
  | 'customers'
  | 'instructors'
  | 'times'
  | 'payments'

interface PageLayoutProps<T> {
  header: string
  refetch: () => void
  item: ItemType
  columns: ColumnDef<T>[]
  data: T[]
  loading: boolean
  totalCount: number
  pagination: PaginationState
  setPagination: Dispatch<SetStateAction<PaginationState>>
}

export function PageLayout<T extends any>(props: PageLayoutProps<T>) {
  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">{props.header}</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <div>
          <CreateUpdateItemModal
            item={props.item}
            refetch={props.refetch}
            type="create"
          />
        </div>
        <DataTable
          columns={props.columns}
          data={props.data}
          loading={props.loading}
          totalCount={props.totalCount}
          pagination={props.pagination}
          setPagination={props.setPagination}
        />
      </div>
    </main>
  )
}
