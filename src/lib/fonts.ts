import { Inter, Manrope, Playfair_Display, Poppins, Volkhov } from 'next/font/google'

/**
 * Brand fonts extracted from the Sajda Figma.
 * Each exposes a CSS variable consumed by the Tailwind `@theme` in globals.css.
 * - Playfair Display / Volkhov → display & headings
 * - Poppins / Manrope → UI & body
 * - Inter → dense UI / dashboard
 */

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

export const volkhov = Volkhov({
  subsets: ['latin'],
  variable: '--font-volkhov',
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/** Convenience: all font CSS-variable class names joined for the <html> element. */
export const fontVariables = [
  playfair.variable,
  volkhov.variable,
  poppins.variable,
  manrope.variable,
  inter.variable,
].join(' ')
