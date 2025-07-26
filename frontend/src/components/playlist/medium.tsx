import { useSuspenseQuery } from "@tanstack/react-query";
import type { ClassValue } from "clsx";
import { Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { playlistQueryOptions } from "@/utils/playlist";
import { ErrorWrapper } from "../error";
import { Skeleton } from "../ui/skeleton";

export function PlaylistMedium({
	playlistID,
	className,
}: {
	playlistID: string;
	className?: ClassValue;
}) {
	return (
		<div className={cn("h-full w-full py-2 ", className)}>
			<div className="h-full w-[200px] shrink-0 [@container(max-width:600px)]:w-[150px]">
				<div className="@container h-full w-full overflow-hidden rounded-sm ">
					<ErrorWrapper className="rounded-none">
						<Suspense fallback={<SuspenseUI />}>
							<Render playlistID={playlistID} />
						</Suspense>
					</ErrorWrapper>
				</div>
			</div>
		</div>
	);
}
function SuspenseUI() {
	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-3 [container-type:size]">
			<div className="h-[70%] w-full shrink-0 rounded-sm [@container(max-height:200px)]:h-[50%]">
				<Skeleton className="h-full w-full" />
			</div>

			<div className="flex h-fit w-full flex-col items-start justify-start gap-1">
				<Skeleton className="h-3 w-[70%]" />
				<Skeleton className="h-3 w-[50%]" />
			</div>
		</div>
	);
}

function Render({ playlistID }: { playlistID: string }) {
	const { data, error } = useSuspenseQuery(playlistQueryOptions(playlistID));
	if (error) throw error;

	const titleRef = useRef<HTMLParagraphElement>(null);
	const [isWrapped, setIsWrapped] = useState(false);

	useEffect(() => {
		const el = titleRef.current;
		if (!el) return;

		const checkWrap = () => {
			if (el.scrollHeight > el.clientHeight) {
				setIsWrapped(true);
			} else {
				setIsWrapped(false);
			}
		};

		checkWrap();

		const observer = new ResizeObserver(checkWrap);
		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-3 [container-type:size]">
			<div className="h-[70%] w-full shrink-0 [@container(max-height:200px)]:h-[50%]">
				<img
					src={data.images[0].url}
					alt={data.name}
					className="h-full w-full rounded-sm object-cover"
				/>
			</div>

			<div className="flex h-fit w-full flex-col items-start justify-start gap-1">
				<p
					ref={titleRef}
					className="peer z-10 line-clamp-2 shrink-0 bg-transparent font-semibold @[150px]:text-xs @[200px]:text-sm @[300px]:text-base text-white text-xs leading-tight"
				>
					{data.name}
				</p>

				{!isWrapped && (
					<p className="line-clamp-2 font-semibold @[150px]:text-xs @[300px]:text-sm text-sm text-white/50 leading-tight">
						By {data.owner.display_name}
					</p>
				)}
			</div>
		</div>
	);
}
