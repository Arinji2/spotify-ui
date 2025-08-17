import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { ArtistCard } from "@/components/artist/card";
import { Filters } from "@/components/filter";
import { Navbar } from "@/components/navbar";
import { PlaylistMedium } from "@/components/playlist/medium";
import { PlaylistSmall } from "@/components/playlist/small";
import { parseContentId } from "@/lib/checker";
import { useDesignMode } from "@/lib/design";
import { useResponsive } from "@/lib/responsive";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { isMobile } = useResponsive();
	const { isDesignMode } = useDesignMode();
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);
	return (
		<div className="flex h-[100svh] w-full flex-col items-center justify-start gap-2 px-2 py-2">
			<Navbar />

			<div className="flex h-full w-full flex-row items-center justify-center gap-2">
				{/* Left Sidebar */}
				<div className="hidden h-full w-[20%] shrink-0 rounded-md bg-zinc-800 md:block"></div>

				<div className="h-full w-full overflow-hidden rounded-md bg-gradient-to-b from-blue-800/40 to-[40%] to-zinc-900 p-4 px-1">
					{hasMounted && (
						<ResponsiveGridLayout
							draggableCancel=".no-drag"
							key={`layout-${isDesignMode}`}
							onResizeStop={(newItem) => {
								for (const item of newItem) {
									if (item.i === "playlists") {
										const snapped = Math.round(item.h / 2) * 2;
										item.h = snapped;
									}
								}
							}}
							className="layout"
							breakpoints={{ lg: 1024, md: 768, sm: 0 }}
							cols={{ lg: 3, md: 3, sm: 1 }}
							rowHeight={30}
							isResizable={isMobile ? false : isDesignMode}
							isDraggable={isMobile ? false : isDesignMode}
							margin={[0, 10]}
							useCSSTransforms={true}
							compactType="horizontal"
							preventCollision={true}
							containerPadding={[0, 0]}
						>
							<div
								key="filters"
								data-grid={{ x: 0, y: 0, w: 1, h: 1, maxH: 1 }}
							>
								<Filters
									items={[
										{ name: "All", active: true },
										{ name: "Music", active: false },
										{ name: "Podcasts", active: false },
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
								<div className="grid w-full @md:grid-cols-3 grid-cols-2 gap-x-3">
									{[
										"51F1tRoACwMG0xfCEeXU4f",
										"4NHOP3Wtcldm6i5ABPR7cc",
										"6efnlir2xmESQV1nTuXmWO",
										"0JFatPoPq82gNcPa4esOzj",
										"6j4w1woXd7xzGCNQoKrpY9",
										"00L6YaFg8TlZC30ktupQGQ",
										"58HdVBtaxycPqt300NjqOk",
										"0QhW1ZOGJttVn5sEtLuJIo",
									].map((playlistID) => (
										<PlaylistSmall key={playlistID} playlistID={playlistID} />
									))}
								</div>
							</div>
							<div
								key="made-for-you"
								className="@container h-full w-full overflow-hidden"
								data-grid={{
									x: 0,
									y: 2,
									w: 3,
									h: 7,
									minH: 4,
								}}
							>
								<div className="flex h-full flex-col items-start justify-start gap-3 py-2 pt-4 [container-type:size] ">
									<p className="font-semibold text-white text-xl">
										Jump back in
									</p>
									<div className=" no-drag flex h-full w-full flex-row items-center justify-start gap-6 overflow-x-auto ">
										{[
											"51F1tRoACwMG0xfCEeXU4f",
											"4NHOP3Wtcldm6i5ABPR7cc",
											"6efnlir2xmESQV1nTuXmWO",
											"0JFatPoPq82gNcPa4esOzj",
											"artist-2YZyLoL8N0Wb9xBt1NhZWg",
											"6j4w1woXd7xzGCNQoKrpY9",
											"00L6YaFg8TlZC30ktupQGQ",
											"58HdVBtaxycPqt300NjqOk",
											"0QhW1ZOGJttVn5sEtLuJIo",
										].map((playlistID) => {
											const { type, id } = parseContentId(playlistID);
											if (type === "artist") {
												return (
													<ArtistCard className="py-0" key={id} artistID={id} />
												);
											} else {
												return (
													<PlaylistMedium
														className="py-0"
														key={id}
														playlistID={id}
													/>
												);
											}
										})}
									</div>
								</div>
							</div>
						</ResponsiveGridLayout>
					)}
				</div>

				{/* Right Sidebar */}
				<div className="hidden h-full w-[20%] shrink-0 rounded-md bg-zinc-800 md:block"></div>
			</div>
		</div>
	);
}
