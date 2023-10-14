'use client'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/AuthProvider'
import {
  AlignJustify,
  DollarSign,
  GraduationCap,
  Group,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SideMenuTab } from '../SideMenuTab/SideMenuTab'
import { Button } from '../ui/button'

export type SideMenuTabComponents = {
  text: string
  icon: LucideIcon
  path: string
}

const tabs: SideMenuTabComponents[] = [
  {
    text: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    text: 'Groups',
    icon: Group,
    path: '/groups'
  },
  {
    text: 'Customers',
    icon: Users,
    path: '/customers'
  },
  {
    text: 'Payments',
    icon: DollarSign,
    path: '/payments'
  },
  {
    text: 'Instructors',
    icon: GraduationCap,
    path: '/instructors'
  }
]

export function SideMenuButton() {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { logout: setLogout } = useAuth()

  const logOut = () => {
    setLogout()
    setIsSheetOpen(false)
  }

  return (
    <Sheet onOpenChange={() => setIsSheetOpen(!isSheetOpen)} open={isSheetOpen}>
      <SheetTrigger>
        <AlignJustify />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Welcome $username$.</SheetTitle>
          <SheetDescription>
            Start management of your organization now. Use the navigation button
            below to see your performance.
          </SheetDescription>
        </SheetHeader>
        <ul className="flex flex-1 flex-col gap-4 mt-10">
          {tabs.map((t, i) => {
            return (
              <SideMenuTab
                key={i}
                text={t.text}
                icon={t.icon}
                path={t.path}
                closeSheet={() => setIsSheetOpen(false)}
              />
            )
          })}
        </ul>

        <div className="flex flex-1 flex-row-reverse mt-10">
          <Button onClick={() => logOut()}>
            <LogOut />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
