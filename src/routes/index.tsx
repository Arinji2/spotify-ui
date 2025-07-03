import { Filters } from '@/components/filter'
import { Navbar } from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-[100svh] w-full flex-col items-center justify-start gap-2 px-2 py-2">
      <Navbar />
      <div className="flex h-full w-full flex-row items-center justify-center gap-2">
        <div className="h-full w-[25%] shrink-0 rounded-md bg-zinc-800"></div>

        <div className="h-full w-full rounded-md bg-gradient-to-b from-blue-800/40 to-zinc-800 to-[40%] px-6 py-4">
          <Filters
            items={[
              {
                name: 'All',
                active: true,
              },
              {
                name: 'Music',
                active: false,
              },
              {
                name: 'Podcasts',
                active: false,
              },
            ]}
          />
        </div>
        <div className="h-full w-[25%] shrink-0 rounded-md bg-zinc-800"></div>
      </div>
    </div>
  )
}
