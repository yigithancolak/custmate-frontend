'use client'
import Image from 'next/image'
import { SideMenuButton } from '../SideMenuButton/SideMenuButton'
import { ToggleModeMenu } from '../ToggleModeMenu/ToggleModeMenu'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-3">
      <div>
        <SideMenuButton />
      </div>

      <div>
        <Image
          src="/../../custmate.svg"
          width={80}
          height={80}
          alt="custmate logo"
        />
      </div>

      <div>
        <ToggleModeMenu />
      </div>
    </header>
  )
}
