import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ItemType } from '@/layouts/PageLayout/PageLayout'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ItemIcon } from '../ItemIcon/DashboardCardIcon'
import { Button } from '../ui/button'
import { DashboardCardLoading } from './DashboardCardLoading'

type Content = {
  key: string
  value: string | number
}

interface DashboardCardProps {
  type: ItemType
  description: string
  contents: Content[]
  path: string
  loading: boolean
}

export function DashboardCard(props: DashboardCardProps) {
  const t = useTranslations('DashboardPage')
  const commonT = useTranslations('Common.Items')
  const router = useRouter()

  if (props.loading) {
    return <DashboardCardLoading />
  }

  return (
    <Card className="relative flex flex-col flex-1 items-center shadow-md">
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:block w-1/6">
        <ItemIcon className="w-full h-full" type={props.type} />
      </div>
      <CardHeader>
        <CardTitle>{commonT(props.type)}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      {props.contents.map((c) => {
        return (
          <CardContent key={c.key}>
            <div>
              <span className="font-semibold">{c.key}: </span>
              <span>{c.value}</span>
            </div>
          </CardContent>
        )
      })}

      <CardFooter>
        <Button onClick={() => router.push(props.path)}>
          {t('Cards.clickSee')}
        </Button>
      </CardFooter>
    </Card>
  )
}
