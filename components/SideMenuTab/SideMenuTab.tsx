'use client'
import { capitalizeFirstLetter } from '@/lib/helpers/stringHelpers'
import { useRouter } from 'next/navigation'
import { ItemIcon } from '../ItemIcon/DashboardCardIcon'
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
        <ItemIcon type={props.type} className="absolute left-5" />
        <span className="ml-2">{capitalizeFirstLetter(props.type)}</span>
      </Button>
    </li>
  )
}
