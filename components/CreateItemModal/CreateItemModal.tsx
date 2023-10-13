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
import { useState } from 'react'
import { CreateGroupForm } from '../CreateGroupForm/CreateGroupForm'
import { CreateInstructorForm } from '../CreateInstructorForm/CreateInstructorForm'

interface CreateItemModalProps {
  item: 'groups' | 'customers' | 'instructors' | 'times' | 'payments'
  refetch: () => void
}

export function CreateItemModal(props: CreateItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  let FormComponent

  switch (props.item) {
    case 'groups':
      FormComponent = CreateGroupForm
      break
    case 'instructors':
      FormComponent = CreateInstructorForm
      break
    // case 'customers':
    //   FormComponent = ()=>CreateCustomerForm
    //   break
    default:
      FormComponent = CreateGroupForm
  }

  const closeFormModal = () => {
    setIsOpen(false)
  }

  return (
    <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create {props.item}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[70vh]">
        <DialogHeader>
          <DialogTitle>Create {props.item}</DialogTitle>
          <DialogDescription>
            Enter the {props.item} informations
          </DialogDescription>
        </DialogHeader>
        <FormComponent
          refetch={props.refetch}
          closeFormModal={closeFormModal}
        />
      </DialogContent>
    </Dialog>
  )
}
