import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col gap-3 justify-center items-center min-h-[30vh] text-3xl p-2">
      <h2>404 Not Found</h2>
      <p className="text-center">Could not find requested resource</p>
      <Link href="/" className="underline">
        Dashboard
      </Link>
    </main>
  )
}
