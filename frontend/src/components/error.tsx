import { Link } from "@tanstack/react-router";
import type { ClassValue } from "clsx";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function ErrorWrapper({
	children,
	small = false,
	className,
}: {
	children: React.ReactNode;
	small?: boolean;
	className?: ClassValue;
}) {
	const [errorKey, setErrorKey] = useState(0); // Track key to force remount on error

	return (
		<ErrorBoundary
			onReset={() => setErrorKey((prev) => prev + 1)}
			fallbackRender={({ error, resetErrorBoundary }) => (
				<div
					className={cn(
						"flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl bg-red-800 p-4 text-center",
						className,
					)}
				>
					{!small && (
						<h2 className="font-semibold text-2xl text-brand-text tracking-small">
							Something went wrong!
						</h2>
					)}
					<p
						className={cn("font-medium text-lg text-white", {
							"text-base": small,
						})}
					>
						{error?.message}
					</p>
					{!small && (
						<Button
							variant="secondary"
							data-active={true}
							onClick={resetErrorBoundary}
						>
							Try Again
						</Button>
					)}
				</div>
			)}
		>
			<div key={errorKey} className={cn("h-full w-full", className)}>
				{children}
			</div>
		</ErrorBoundary>
	);
}

export function RouteError() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-brand-destructive-dark px-4 text-brand-text">
			<h1 className="font-bold text-3xl tracking-large">
				Oops! Something went wrong.
			</h1>
			<p className="max-w-md text-center text-brand-text/80 text-lg">
				The page failed to load properly or some required data was missing.
			</p>
			<Link
				to="/"
				className="rounded-xl bg-brand-primary px-6 py-3 font-medium text-black text-lg transition hover:bg-brand-primary-dark"
			>
				Go back home
			</Link>
		</div>
	);
}
