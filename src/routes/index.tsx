import { Navbar } from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-[100svh] w-full flex-col items-center justify-start px-2 py-2">
      <Navbar />
    </div>
  )
}
