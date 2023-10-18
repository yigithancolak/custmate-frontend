'use client'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { ItemType } from '@/layouts/PageLayout/PageLayout'
import { GET_ORGANIZATION } from '@/lib/queries/organization'
import { useAuth } from '@/providers/AuthProvider'
import { GetOrganizationResponse } from '@/types/organizationTypes'
import { useQuery } from '@apollo/client'
import { AlignJustify, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SideMenuTab } from '../SideMenuTab/SideMenuTab'
import { Button } from '../ui/button'

export type SideMenuTabComponents = {
  type: 'dashboard' | ItemType
  path: string
}

const tabs: SideMenuTabComponents[] = [
  {
    type: 'dashboard',
    path: '/dashboard'
  },
  {
    type: 'groups',
    path: '/groups'
  },
  {
    type: 'customers',
    path: '/customers'
  },
  {
    type: 'payments',
    path: '/payments'
  },
  {
    type: 'instructors',
    path: '/instructors'
  }
]

export function SideMenuButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { logout: setLogout } = useAuth()
  const [orgName, setOrgName] = useState<string>('')

  const logOut = () => {
    setLogout()
    setIsSheetOpen(false)
  }

  const { data, loading, error } =
    useQuery<GetOrganizationResponse>(GET_ORGANIZATION)

  useEffect(() => {
    if (data && data.getOrganization) {
      setOrgName(data.getOrganization.name)
    }
  }, [data])

  return (
    <Sheet onOpenChange={() => setIsSheetOpen(!isSheetOpen)} open={isSheetOpen}>
      <SheetTrigger>
        <AlignJustify />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Welcome {orgName} </SheetTitle>
          <SheetDescription>
            Start management of your organization now. Use the tabs below to see
            your performance.
          </SheetDescription>
        </SheetHeader>
        <ul className="flex flex-1 flex-col gap-4 mt-10">
          {tabs.map((t, i) => {
            return (
              <SideMenuTab
                key={i}
                type={t.type}
                path={t.path}
                closeSheet={() => setIsSheetOpen(false)}
              />
            )
          })}
        </ul>

        <div className="flex flex-row-reverse mt-10">
          <Button onClick={() => logOut()}>
            <LogOut />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
