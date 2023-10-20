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
import { capitalizeFirstLetter } from '@/lib/helpers/stringHelpers'
import { PenSquare, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateCustomerForm } from '../CreateCustomerForm/CreateCustomerForm'
import { CreateGroupForm } from '../CreateGroupForm/CreateGroupForm'
import { CreateInstructorForm } from '../CreateInstructorForm/CreateInstructorForm'
import { CreatePaymentForm } from '../CreatePaymentForm/CreatePaymentForm'
import { ItemIcon } from '../ItemIcon/DashboardCardIcon'

interface CreateItemModalProps {
  item: ItemType
  refetch: () => void
  type: 'create' | 'update'
  itemId?: string
}

export function CreateItemModal(props: CreateItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeFormModal = () => {
    setIsOpen(false)
  }

  let FormComponent

  switch (props.item) {
    case 'groups':
      FormComponent = CreateGroupForm
      break
    case 'instructors':
      FormComponent = CreateInstructorForm
      break
    case 'customers':
      FormComponent = CreateCustomerForm
      break
    case 'payments':
      FormComponent = CreatePaymentForm
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
              <span>Create {capitalizeFirstLetter(props.item)}</span>
            </div>
          ) : (
            <PenSquare size={16} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-[425px] overflow-y-auto max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>{`${capitalizeFirstLetter(
            props.type
          )} ${capitalizeFirstLetter(props.item)}`}</DialogTitle>
          <DialogDescription>
            Enter the {props.item} informations
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
