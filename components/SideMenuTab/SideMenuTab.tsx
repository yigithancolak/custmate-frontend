'use client'
import { useRouter } from 'next/navigation'
import { SideMenuTabComponents } from '../SideMenuButton/SideMenuButton'
import { Button } from '../ui/button'

export interface SideMenuTabProps extends SideMenuTabComponents {
  closeSheet: () => void
}

export function SideMenuTab(props: SideMenuTabProps) {
  const router = useRouter()
  const handleTabClick = () => {
    router.push(props.path)
    props.closeSheet()
  }

  return (
    <li className="flex flex-1 border-2 rounded-md items-center">
      <Button
        variant="ghost"
        className="w-full h-full p-4 relative"
        onClick={() => handleTabClick()}
      >
        <props.icon className="absolute left-5" />
        <span className="ml-2">{props.text}</span>
      </Button>
    </li>
  )
}
