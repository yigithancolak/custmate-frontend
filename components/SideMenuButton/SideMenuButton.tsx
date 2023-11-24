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
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { SideMenuTab } from '../SideMenuTab/SideMenuTab'
import { Button } from '../ui/button'

export type SideMenuTabComponents = {
  type: 'dashboard' | 'earnings' | ItemType
  path: string
}

const tabs: SideMenuTabComponents[] = [
  {
    type: 'dashboard',
    path: '/dashboard'
  },
  {
    type: 'instructors',
    path: '/instructors'
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
    type: 'earnings',
    path: '/earnings'
  }
]

export function SideMenuButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { logout: setLogout, accessToken } = useAuth()
  const t = useTranslations('Components.SideMenu')

  const logOut = () => {
    setLogout()
    setIsSheetOpen(false)
  }

  const { data, loading, error } = useQuery<GetOrganizationResponse>(
    GET_ORGANIZATION,
    {
      skip: !accessToken
    }
  )

  if (loading || !accessToken) {
    return null
  }

  return (
    <Sheet onOpenChange={() => setIsSheetOpen(!isSheetOpen)} open={isSheetOpen}>
      <SheetTrigger>{accessToken && <AlignJustify />}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            {t('title', { name: data?.getOrganization.name || '...' })}
          </SheetTitle>
          <SheetDescription>{t('desc')}</SheetDescription>
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
            <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
