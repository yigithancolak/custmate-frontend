'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { LIST_INSTRUCTORS_QUERY } from '@/lib/queries/instructor'
import {
  ListInstructorsResponse,
  ListInstructorsVariables
} from '@/types/instructorTypes'
import { useQuery } from '@apollo/client'
import { X } from 'lucide-react'
import { useState } from 'react'

interface CreateItemModalProps {
  item: string
}

export function CreateItemModal(props: CreateItemModalProps) {
  const [times, setTimes] = useState([
    { day: '', start_hour: '', finish_hour: '' }
  ])

  const { data, loading, error } = useQuery<
    ListInstructorsResponse,
    ListInstructorsVariables
  >(LIST_INSTRUCTORS_QUERY, {
    variables: {
      offset: 0,
      limit: 100
    }
  })

  const handleTimeChange = (
    index: number,
    field: keyof (typeof times)[0],
    value: string
  ) => {
    const newTimes = [...times]
    newTimes[index][field] = value
    setTimes(newTimes)
  }

  const addTime = () => {
    setTimes([...times, { day: '', start_hour: '', finish_hour: '' }])
  }

  const removeTime = (indexToRemove: number) => {
    setTimes(times.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(times)
  }

  if (loading) {
    return 'loading'
  }

  if (error) {
    return 'error'
  }

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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="choose-instructor" className="text-right">
                Choose Instructor
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  {data?.listInstructors.map((instructor) => {
                    return (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 py-4">
              {times.map((time, index) => (
                <div key={index} className="my-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`day-${index}`} className="text-right">
                      Day
                    </Label>
                    <X
                      onClick={() => removeTime(index)}
                      className="cursor-pointer"
                    />
                  </div>
                  <Input
                    id={`day-${index}`}
                    value={time.day}
                    onChange={(e) =>
                      handleTimeChange(index, 'day', e.target.value)
                    }
                    className="col-span-3 w-full mb-2"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor={`start_hour-${index}`}
                        className="text-right"
                      >
                        Start Hour
                      </Label>
                      <Input
                        id={`start_hour-${index}`}
                        value={time.start_hour}
                        onChange={(e) =>
                          handleTimeChange(index, 'start_hour', e.target.value)
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`finish_hour-${index}`}
                        className="text-right"
                      >
                        Finish Hour
                      </Label>
                      <Input
                        id={`finish_hour-${index}`}
                        value={time.finish_hour}
                        onChange={(e) =>
                          handleTimeChange(index, 'finish_hour', e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addTime}>
                Add Time
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
