import { Filters } from '@/components/filter'
import { Navbar } from '@/components/navbar'
import { PlaylistSmall } from '@/components/playlist/small'
import { useDesignMode } from '@/lib/design'
import { useResponsive } from '@/lib/responsive'
import { createFileRoute } from '@tanstack/react-router'

import { Responsive, WidthProvider } from 'react-grid-layout'

const ResponsiveGridLayout = WidthProvider(Responsive)

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isMobile } = useResponsive()
  const { isDesignMode } = useDesignMode()
  return (
    <div className="flex h-[100svh] w-full flex-col items-center justify-start gap-2 px-2 py-2">
      <Navbar />

      <div className="flex h-full w-full flex-row items-center justify-center gap-2">
        {/* Left Sidebar */}
        <div className="hidden h-full w-[20%] shrink-0 rounded-md bg-zinc-800 md:block"></div>

        <div className="h-full w-full overflow-hidden rounded-md bg-gradient-to-b from-blue-800/40 to-zinc-800 to-[40%] p-4 px-1">
          <ResponsiveGridLayout
            draggableCancel=".no-drag"
            key={`layout-${isDesignMode}`}
            onResizeStop={(newItem) => {
              for (const item of newItem) {
                if (item.i === 'playlists') {
                  const snapped = Math.round(item.h / 2) * 2
                  item.h = snapped
                }
              }
            }}
            className="layout"
            breakpoints={{ lg: 1024, md: 768, sm: 0 }}
            cols={{ lg: 3, md: 3, sm: 1 }}
            rowHeight={40}
            isResizable={isMobile ? false : isDesignMode}
            isDraggable={isMobile ? false : isDesignMode}
            margin={[0, 0]}
            useCSSTransforms={true}
            compactType="horizontal"
            preventCollision={true}
            containerPadding={[0, 0]}
          >
            <div key="filters" data-grid={{ x: 0, y: 0, w: 1, h: 1, maxH: 1 }}>
              <Filters
                items={[
                  { name: 'All', active: true },
                  { name: 'Music', active: false },
                  { name: 'Podcasts', active: false },
                ]}
              />
            </div>

            <div
              key="playlists"
              className="@container h-full w-full overflow-hidden"
              data-grid={{
                x: 0,
                y: 1,
                w: 3,
                minH: 2,
                h: 6,
                maxH: 6,
              }}
            >
              <div className="grid w-full grid-cols-2 gap-x-3 @md:grid-cols-3">
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
                  <PlaylistSmall key={playlistID} playlistID={playlistID} />
                ))}
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>

        {/* Right Sidebar */}
        <div className="hidden h-full w-[20%] shrink-0 rounded-md bg-zinc-800 md:block"></div>
      </div>
    </div>
  )
}
