import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CustomerItem } from '@/types/customerTypes'
import { GroupItem } from '@/types/groupTypes'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface FormComboboxItemProps {
  field:
    | ControllerRenderProps<any, 'groupId'>
    | ControllerRenderProps<any, 'customerId'>
  items: GroupItem[] | CustomerItem[]
  form: UseFormReturn<any, any, undefined>
  searchTerm: string
  handleSearchTermChange: (search: string) => void
  fieldName: 'groupId' | 'customerId'
  handleItemSelect?: (itemId: string) => void
}

export function FormComboboxItem(props: FormComboboxItemProps) {
  const {
    field,
    form,
    items,
    searchTerm,
    handleSearchTermChange,
    fieldName,
    handleItemSelect
  } = props

  return (
    <FormItem className="flex flex-col w-full ">
      <FormLabel>Choose Group</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-[240px] justify-between',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value
                ? items.find((item) => item.id === field.value)?.name
                : 'Select group'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <Input
              className="w-full"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              placeholder="Search group..."
            />
            <CommandEmpty>No group found.</CommandEmpty>
            <CommandGroup>
              {items.map(
                (item) =>
                  item.name.toLowerCase().includes(searchTerm) && (
                    <CommandItem
                      value={item.id}
                      key={item.id}
                      onSelect={() => {
                        form.setValue(fieldName, item.id)
                        if (handleItemSelect) {
                          handleItemSelect(item.id)
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          item.id === field.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  )
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )
}
