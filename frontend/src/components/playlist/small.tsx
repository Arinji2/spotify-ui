import { useSuspenseQuery } from "@tanstack/react-query";
import type { ClassValue } from "clsx";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { playlistQueryOptions } from "@/utils/playlist";
import { ErrorWrapper } from "../error";
import { Skeleton } from "../ui/skeleton";

export function PlaylistSmall({
	playlistID,
	className,
}: {
	playlistID: string;
	className?: ClassValue;
}) {
	return (
		<div className={cn("h-[80px] w-full py-2", className)}>
			<div className="@container h-full w-full overflow-hidden rounded-sm bg-white/15">
				<ErrorWrapper small className="rounded-none">
					<Suspense fallback={<SuspenseUI />}>
						<Render playlistID={playlistID} />
					</Suspense>
				</ErrorWrapper>
			</div>
		</div>
	);
}
function SuspenseUI() {
	return (
		<div
			className={
				"flex h-full w-full flex-row items-center justify-start gap-2 pr-2"
			}
		>
			<div className="h-full w-[30%] shrink-0">
				<Skeleton className="h-full w-full" />
			</div>
			<div className="flex h-full w-full flex-col items-start justify-center gap-2">
				<Skeleton className="h-3 w-[70%]" />
				<Skeleton className="h-3 w-[50%]" />
			</div>
		</div>
	);
}
function Render({ playlistID }: { playlistID: string }) {
	const { data, error } = useSuspenseQuery(playlistQueryOptions(playlistID));
	if (error) {
		throw error;
	}
	return (
		<div
			className={
				"flex h-full w-full flex-row items-center justify-start gap-2 pr-2"
			}
		>
			<div className="h-full w-[30%] shrink-0">
				<img
					src={data.images[0].url}
					alt={data.name}
					className="h-full w-full object-cover"
				/>
			</div>
			<p className="line-clamp-2 font-semibold @[150px]:text-xs @[200px]:text-sm @[300px]:text-base text-white text-xs leading-tight">
				{data.name}
			</p>
		</div>
	);
}
