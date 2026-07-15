/**
 * Brand imagery from the Sajda design (in /public/design).
 * Verified: Kaaba & Madinah illustrations, the Sajda logo, and destination photos.
 */
export const BRAND = {
  logo: '/design/1ba961443f847f7b248e93e14eabd1a17946f660.png',
  kaaba: '/design/4639cf09161f7749984b7825db144c37d181dd8e.png',
  madinah: '/design/d693b314002eb2673762c90875ed2713ed31d495.png',
  europe: '/design/2d135a53d007dca9be8093ace55b092b81496cf2.jpg',
}

const CATEGORY_IMAGE: Record<string, string> = {
  umrah: BRAND.kaaba,
  hajj: BRAND.kaaba,
  tour: BRAND.europe,
}

const SLUG_IMAGE: Record<string, string> = {
  'special-umrah-package': BRAND.kaaba,
  'premium-umrah-family': BRAND.madinah,
  'umrah-economy-10-days': BRAND.madinah,
  'hajj-sacred-fifth-pillar': BRAND.kaaba,
  'premium-europe-sightseeing': BRAND.europe,
  'explore-bangladesh-sundarbans': BRAND.europe,
}

type Mediaish = { url?: string | null } | string | number | null | undefined

/** Resolve a usable image URL for a package: its own media, else a design fallback. */
export function packageImage(pkg: {
  slug?: string | null
  category?: string | null
  heroImage?: Mediaish
}): string {
  if (pkg.heroImage && typeof pkg.heroImage === 'object' && pkg.heroImage.url) {
    return pkg.heroImage.url
  }
  if (pkg.slug && SLUG_IMAGE[pkg.slug]) return SLUG_IMAGE[pkg.slug]
  if (pkg.category && CATEGORY_IMAGE[pkg.category]) return CATEGORY_IMAGE[pkg.category]
  return BRAND.kaaba
}

/** Whether the category's default art is a transparent illustration (needs a light backdrop). */
export function isIllustration(category?: string | null): boolean {
  return category === 'hajj' || category === 'umrah'
}
