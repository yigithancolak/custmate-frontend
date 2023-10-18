import { ItemType } from '@/layouts/PageLayout/PageLayout'
import {
  DollarSign,
  GraduationCap,
  Group,
  LayoutDashboard,
  Users
} from 'lucide-react'

interface DashboardCardIconProps {
  type: 'dashboard' | ItemType
  className?: string
  size?: number
}
export function ItemIcon(props: DashboardCardIconProps) {
  switch (props.type) {
    case 'dashboard':
      return <LayoutDashboard {...props} />
    case 'groups':
      return <Group {...props} />
    case 'customers':
      return <Users {...props} />
    case 'instructors':
      return <GraduationCap {...props} />
    case 'payments':
      return <DollarSign {...props} />
  }
}
