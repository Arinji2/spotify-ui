import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'

type FilterItem = {
  name: string
  icon?: LucideIcon
  active: boolean
}

{
  /*
            className={cn(
              'flex h-fit w-fit items-center gap-2 rounded-3xl bg-white/15 p-2 px-4 tracking-wide text-white hover:bg-white hover:text-black',
              {
                'bg-white text-black': item.active,
              },
            )}
   */
}
export function Filters({ items }: { items: Array<FilterItem> }) {
  return (
    <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
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
