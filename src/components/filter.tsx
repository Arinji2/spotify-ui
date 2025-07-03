import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type FilterItem = {
  name: string
  icon?: LucideIcon
  active: boolean
}

export function Filters({ items }: { items: Array<FilterItem> }) {
  return (
    <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.name}
            className={cn(
              'flex h-fit w-fit items-center gap-2 rounded-3xl bg-white/15 p-2 px-4 tracking-wide text-white hover:bg-white hover:text-black',
              {
                'bg-white text-black': item.active,
              },
            )}
          >
            {Icon && <Icon className="size-4" />}
            {item.name}
          </div>
        )
      })}
    </div>
  )
}
