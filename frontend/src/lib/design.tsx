import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface DesignModeContextType {
	isDesignMode: boolean;
	toggleDesignMode: () => void;
}

const DesignModeContext = createContext<DesignModeContextType | undefined>(
	undefined,
);

export function DesignModeProvider({ children }: { children: ReactNode }) {
	const [isDesignMode, setIsDesignMode] = useState(false);

	useEffect(() => {
		const designMode = localStorage.getItem("designMode");
		if (designMode) {
			setIsDesignMode(designMode === "true");
		}
	}, []);

	const toggleDesignMode = () => {
		setIsDesignMode((prev) => {
			const newValue = !prev;
			localStorage.setItem("designMode", JSON.stringify(newValue));
			return newValue;
		});
	};

	return (
		<DesignModeContext.Provider value={{ isDesignMode, toggleDesignMode }}>
			{children}
		</DesignModeContext.Provider>
	);
}

export function useDesignMode() {
	const context = useContext(DesignModeContext);
	if (context === undefined) {
		throw new Error("useDesignMode must be used within a DesignModeProvider");
	}
	return context;
}
