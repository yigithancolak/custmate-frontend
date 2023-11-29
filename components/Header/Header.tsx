'use client'
import Image from 'next/image'
import Link from 'next/link'
import { SideMenuButton } from '../SideMenuButton/SideMenuButton'
import { ToggleModeMenu } from '../ToggleModeMenu/ToggleModeMenu'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-50 shadow-md h-[10vh] sticky top-0 z-20">
      <div className="w-10">
        <SideMenuButton />
      </div>

      <Link href="/dashboard">
        <Image
          src="/../../custmate.svg"
          width={80}
          height={80}
          alt="custmate logo"
        />
      </Link>

      <div className="w-10">
        <ToggleModeMenu />
      </div>
    </header>
  )
}
