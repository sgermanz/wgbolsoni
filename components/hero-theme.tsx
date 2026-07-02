"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type HeroThemeContextValue = {
  heroOnDark: boolean;
  setHeroOnDark: (value: boolean) => void;
};

const HeroThemeContext = createContext<HeroThemeContextValue | null>(null);

/**
 * Lets a hero component (e.g. the home carousel, whose background can change
 * per slide between light and dark) report its current darkness up to the
 * navbar, which lives outside it in the tree. Wraps the navbar + page body
 * in the root layout.
 */
export function HeroThemeProvider({ children }: { children: ReactNode }) {
  const [heroOnDark, setHeroOnDark] = useState(false);
  return (
    <HeroThemeContext.Provider value={{ heroOnDark, setHeroOnDark }}>
      {children}
    </HeroThemeContext.Provider>
  );
}

/** Call from a hero component with whether its current background is dark. */
export function useReportHeroOnDark(onDark: boolean) {
  const ctx = useContext(HeroThemeContext);
  useEffect(() => {
    ctx?.setHeroOnDark(onDark);
    return () => ctx?.setHeroOnDark(false);
  }, [onDark, ctx]);
}

/** Call from the navbar to read whether the hero currently under it is dark. */
export function useHeroOnDark(): boolean {
  return useContext(HeroThemeContext)?.heroOnDark ?? false;
}
