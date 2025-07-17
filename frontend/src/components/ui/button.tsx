import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	[
		"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm transition-all",
		"disabled:pointer-events-none disabled:opacity-50",
		'shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		"outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0",
	].join(" "),
	{
		variants: {
			variant: {
				default:
					"bg-blue-700 text-white hover:bg-blue-700/90 active:bg-blue-700/80 data-[active=true]:bg-blue-700/80",
				destructive:
					"bg-red-700 text-white hover:bg-red-700/90 active:bg-red-700/80 data-[active=true]:bg-red-700/80",
				outline:
					"border border-white/20 bg-transparent text-white hover:bg-white/10 active:bg-white/15 data-[active=true]:bg-white/15",
				secondary:
					"bg-white/15 text-white hover:bg-white hover:text-black active:bg-white active:text-black data-[active=true]:bg-white data-[active=true]:text-black",
				ghost:
					"bg-transparent text-white hover:bg-white/10 active:bg-white/15 data-[active=true]:bg-white/15",
				link: "text-white underline-offset-4 hover:underline data-[active=true]:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded px-3 text-sm has-[>svg]:px-2.5",
				lg: "h-10 rounded px-6 text-base has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
