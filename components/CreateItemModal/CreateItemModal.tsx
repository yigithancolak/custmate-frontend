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
import { CreateGroupForm } from '../CreateGroupForm/CreateGroupForm'

interface CreateItemModalProps {
  item: string
}

export function CreateItemModal(props: CreateItemModalProps) {
  return (
    <Dialog>
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
        <CreateGroupForm />
      </DialogContent>
    </Dialog>
  )
}
