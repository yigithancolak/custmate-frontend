'use client'

import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'

export default function InstructorsPage() {
  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Instructors Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="instructors" />
        {/* <DataTable columns={groupColumns} data={groups} loading={loading} /> */}
      </div>
    </main>
  )
}
