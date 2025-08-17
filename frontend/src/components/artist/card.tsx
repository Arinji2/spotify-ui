import { useSuspenseQuery } from "@tanstack/react-query";
import type { ClassValue } from "clsx";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { artistQueryOptions } from "@/utils/artist";
import { ErrorWrapper } from "../error";
import { Skeleton } from "../ui/skeleton";

export function ArtistCard({
	artistID,
	className,
}: {
	artistID: string;
	className?: ClassValue;
}) {
	return (
		<div className={cn("h-full w-full py-2 ", className)}>
			<div className="h-full w-[150px] shrink-0 [@container(max-width:600px)]:w-[100px]">
				<div className="@container h-full w-full overflow-hidden rounded-sm ">
					<ErrorWrapper className="rounded-none">
						<Suspense fallback={<SuspenseUI />}>
							<Render artistID={artistID} />
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
			<div className="h-[70%] w-full shrink-0 [@container(max-height:200px)]:h-[50%]">
				<Skeleton className=" h-full w-full rounded-full" />
			</div>

			<div className="flex h-fit w-full flex-col items-start justify-start gap-1">
				<Skeleton className="h-3 w-[70%]" />
			</div>
		</div>
	);
}

function Render({ artistID }: { artistID: string }) {
	const { data, error } = useSuspenseQuery(artistQueryOptions(artistID));
	if (error) throw error;

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-3 [container-type:size]">
			<div className="h-[70%] w-full shrink-0 [@container(max-height:200px)]:h-[50%] flex flex-col items-center justify-center">
				<img
					src={data.images[0].url}
					alt={data.name}
					className="aspect-square w-full shrink-0 rounded-full object-cover md:h-full md:w-auto"
				/>
			</div>

			<div className="flex h-fit w-full flex-col items-start justify-start gap-1">
				<p className="peer z-10 line-clamp-2 shrink-0 bg-transparent font-semibold @[150px]:text-sm @[200px]:text-lg @[300px]:text-xl text-white text-xs leading-tight">
					{data.name}
				</p>
			</div>
		</div>
	);
}
