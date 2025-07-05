import { Filters } from '@/components/filter'
import { Navbar } from '@/components/navbar'
import { PlaylistSmall } from '@/components/playlist/small'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-[100svh] w-full flex-col items-center justify-start gap-2 px-2 py-2">
      <Navbar />

      <div className="flex h-full w-full flex-row items-center justify-center gap-2">
        <div className="h-full w-[20%] shrink-0 rounded-md bg-zinc-800"></div>

        <div className="flex h-full w-full flex-col items-center justify-start gap-4 rounded-md bg-gradient-to-b from-blue-800/40 to-zinc-800 to-[40%] px-6 py-4">
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

          <div className="@container h-fit w-full">
            <div className="grid w-full grid-cols-2 gap-3 @md:grid-cols-3 @lg:grid-cols-4">
              {[
                '51F1tRoACwMG0xfCEeXU4f',
                '4NHOP3Wtcldm6i5ABPR7cc',
                '6efnlir2xmESQV1nTuXmWO',
                '0JFatPoPq82gNcPa4esOzj',
                '6j4w1woXd7xzGCNQoKrpY9',
                '00L6YaFg8TlZC30ktupQGQ',
                '58HdVBtaxycPqt300NjqOk',
                '0QhW1ZOGJttVn5sEtLuJIo',
              ].map((playlistID) => (
                <PlaylistSmall playlistID={playlistID} />
              ))}
            </div>
          </div>
        </div>
        <div className="h-full w-[20%] shrink-0 rounded-md bg-zinc-800"></div>
      </div>
    </div>
  )
}
