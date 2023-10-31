import { Ban } from 'lucide-react'

export function FormError() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-[300px]">
      <span className="font-bold">Something went wrong :/ </span>
      <Ban color="red" className="w-1/2 h-1/2" />
    </div>
  )
}
