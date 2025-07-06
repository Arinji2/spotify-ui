import type { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'

type FilterItem = {
  name: string
  icon?: LucideIcon
  active: boolean
}

export function Filters({ items }: { items: Array<FilterItem> }) {
  return (
    <div className="flex h-full w-full flex-row items-center justify-start gap-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Button
            className="rounded-3xl"
            variant="secondary"
            key={item.name}
            data-active={item.active}
          >
            {Icon && <Icon className="size-4" />}
            {item.name}
          </Button>
        )
      })}
    </div>
  )
}
