'use client'
import { ToggleModeMenu } from '../ToggleModeMenu/ToggleModeMenu'

export default function Header() {
  return (
    <header className="flex flex-row-reverse p-2">
      <div>
        <ToggleModeMenu />
      </div>
    </header>
  )
}
