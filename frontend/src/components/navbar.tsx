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

export function Navbar() {
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
            className="h-full w-[300px] bg-transparent text-base font-medium text-white outline-none"
          />
          <X className="size-5 text-white/60 hover:text-white" />
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
