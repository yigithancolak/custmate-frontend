import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { DashboardCardLoading } from './DashboardCardLoading'

type Content = {
  key: string
  value: string
}

interface DashboardCardProps {
  title: string
  description: string
  contents: Content[]
  path: string
  loading: boolean
}

export function DashboardCard(props: DashboardCardProps) {
  const router = useRouter()

  if (props.loading) {
    return <DashboardCardLoading />
  }

  return (
    <Card className="flex flex-col flex-1 items-center">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      {props.contents.map((c) => {
        return (
          <CardContent key={c.key}>
            <p>{`${c.key}: ${c.value}`}</p>
          </CardContent>
        )
      })}

      <CardFooter>
        <Button onClick={() => router.push(props.path)}>Click to see</Button>
      </CardFooter>
    </Card>
  )
}
