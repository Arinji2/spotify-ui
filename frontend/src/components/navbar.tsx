import { cn } from '@/lib/utils'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Compass,
  Home,
  Search,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [input, setInput] = useState('')
  return (
    <div className="flex h-fit w-full items-center justify-between">
      <div className="flex h-full w-fit items-center justify-center gap-3">
        <ChevronLeft className="size-8 text-white/40 hover:text-white" />
        <ChevronRight className="size-8 text-white/40 hover:text-white" />
      </div>

      <div className="flex h-full w-fit items-center justify-center gap-4">
        <div className="aspect-square h-fit w-fit rounded-full bg-zinc-800 p-3">
          <Home className="size-5 text-white/60 hover:text-white" />
        </div>
        <div className="flex h-full w-fit items-center justify-center gap-3 rounded-4xl border-2 border-transparent bg-zinc-800 p-3 focus-within:border-white">
          <Search className="size-5 text-white/60 hover:text-white" />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="h-full w-[300px] bg-transparent font-medium text-sm text-white outline-none"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <X
            className={cn(
              'size-5 text-white/60 transition-opacity duration-200 ease-in-out hover:text-white',
              {
                'opacity-0': input === '',
              },
            )}
          />
          <div className="h-full w-[2px] bg-white/10"></div>
          <Compass className="size-5 text-white/60 hover:text-white" />
        </div>
      </div>
      <div className="flex h-full w-fit items-center justify-center gap-6">
        <Bell className="size-5 text-white/40 hover:text-white" />
        <Users className="size-5 text-white/40 hover:text-white" />
        <div className="size-8 rounded-full bg-gray-500"></div>
      </div>
    </div>
  )
}
