'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ItemType } from '@/layouts/PageLayout/PageLayout'
import { PenSquare, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CustomerForm } from '../CustomerForm/CustomerForm'
import { GroupForm } from '../GroupForm/GroupForm'
import { InstructorForm } from '../InstructorForm/InstructorForm'
import { ItemIcon } from '../ItemIcon/DashboardCardIcon'
import { PaymentForm } from '../PaymentForm/PaymentForm'

interface BaseItemProps {
  refetch: () => void
  type: 'create' | 'update'
  itemId?: string
}

export interface ModalFormProps extends BaseItemProps {
  closeFormModal: () => void
}

export interface CreateUpdateItemModalProps extends BaseItemProps {
  item: ItemType
}

export function CreateUpdateItemModal(props: CreateUpdateItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const t = useTranslations('Components.CreateUpdateForms')

  const closeFormModal = () => {
    setIsOpen(false)
  }

  let FormComponent

  switch (props.item) {
    case 'groups':
      FormComponent = GroupForm
      break
    case 'instructors':
      FormComponent = InstructorForm
      break
    case 'customers':
      FormComponent = CustomerForm
      break
    case 'payments':
      FormComponent = PaymentForm
      break
    default:
      return
  }

  return (
    <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-3 mr-2">
          {props.type === 'create' ? (
            <div className="flex items-center">
              <Plus className="h-full" />
              <ItemIcon type={props.item} className="h-full" />
              <span>
                {t('createButton', { item: t(`Items.${props.item}`) })}
              </span>
            </div>
          ) : (
            <PenSquare size={16} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-[425px] overflow-y-auto max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>
            {t('title', {
              type: t(`Types.${props.type}`),
              item: t(`Items.${props.item}`)
            })}
          </DialogTitle>
          <DialogDescription>
            {t('desc', { item: t(`Items.${props.item}`) })}
          </DialogDescription>
        </DialogHeader>
        <FormComponent
          refetch={props.refetch}
          closeFormModal={closeFormModal}
          type={props.type}
          itemId={props.itemId}
        />
      </DialogContent>
    </Dialog>
  )
}
