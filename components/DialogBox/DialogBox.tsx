'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

interface DialogBoxProps {
  title: string
  description: string
  trigger: ReactNode
  fn: () => void
  loading: boolean
}

export function DialogBox(props: DialogBoxProps) {
  const t = useTranslations('Components.DeleteDialogBox')
  return (
    <AlertDialog>
      <AlertDialogTrigger>{props.trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')} </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => props.fn()}
            disabled={props.loading}
          >
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
