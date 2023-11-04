import {
  adjustDateStringFormat,
  convertStringToDate
} from '@/lib/helpers/dateHelpers'
import { differenceInDays } from 'date-fns'
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'

interface DateWarningTypes {
  dateString: string
}

const message = (difference: number): string => {
  if (difference < 0) {
    return `${difference} days passed`
  }

  if (difference > 0 && difference < 7) {
    return `Must pay this week: ${difference} days left`
  }

  return `${difference} days left`
}

const icon = (difference: number) => {
  if (difference < 0) {
    return <AlertCircle className="text-red-600" />
  }

  if (difference > 0 && difference < 7) {
    return <AlertTriangle className="text-yellow-400" />
  }

  return <ShieldCheck className="text-green-400" />
}

export function DateWarningToolTip(props: DateWarningTypes) {
  const givenDate = convertStringToDate(props.dateString)
  const dayDifference = differenceInDays(givenDate, new Date())

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex gap-2 items-center">
            <span>{adjustDateStringFormat(props.dateString)}</span>
            {icon(dayDifference)}
          </div>
        </TooltipTrigger>
        <TooltipContent>{message(dayDifference)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
