import { Fraunces, Libre_Franklin, IBM_Plex_Mono, Caveat } from "next/font/google";

// Display serif — characterful, used for headlines, pull-quotes, masthead.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  display: "swap",
});

// Humanist sans — body copy, UI chrome, navigation.
export const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Monospace — prices, ISBNs, stock counts, order numbers.
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

// Handwritten accent — used sparingly for staff-pick index cards only.
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${libreFranklin.variable} ${plexMono.variable} ${caveat.variable}`;
