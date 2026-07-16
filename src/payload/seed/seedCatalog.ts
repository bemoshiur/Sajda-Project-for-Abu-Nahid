import type { Payload } from 'payload'
import { richText, daysFromNow } from './lib'

type Spec = { label: string; value: string }

type SeedPackage = {
  title: string
  slug: string
  category: 'tour' | 'hajj' | 'umrah'
  featured?: boolean
  badge: 'none' | 'top_package' | 'best_seller' | 'popular'
  tier: 'economy' | 'standard' | 'premium'
  ratingCount: number
  specs: Spec[]
  shortDescription: string
  basePrice: number
  days: number
  nights: number
  destination: string
  overview: string[]
  hotelInfo?: string
  flightInfo?: string
  foodInfo?: string
  included: string[]
  excluded: string[]
  itinerary: { day: number; title: string; description: string }[]
  highlights: string[]
  departures: { inDays: number; nights: number; price: number; seatsTotal: number }[]
}

const PACKAGES: SeedPackage[] = [
  {
    title: 'Special Umrah Package',
    slug: 'special-umrah-package',
    category: 'umrah',
    featured: true,
    badge: 'best_seller',
    tier: 'standard',
    ratingCount: 48,
    specs: [
      { label: 'Makkah Hotel', value: '4★ · 250m from Haram' },
      { label: 'Madinah Hotel', value: '4★ · 300m' },
      { label: 'Room Sharing', value: 'Quad Sharing' },
      { label: 'Distance to Haram', value: '250m' },
    ],
    shortDescription:
      'A peaceful, well-organized Umrah journey with visa, flights, hotel, transport and expert guidance.',
    basePrice: 165000,
    days: 14,
    nights: 13,
    destination: 'Makkah & Madinah, Saudi Arabia',
    overview: [
      'Experience a peaceful and well-organized Umrah journey with our special package, designed to make every step smooth, comfortable, and spiritually meaningful.',
      'From visa processing and flights to hotel, transport, ziyarah, and expert guidance, we ensure complete support so you can focus on your worship with confidence and peace of mind.',
    ],
    hotelInfo: '4-star hotels within walking distance of Haram in both Makkah and Madinah.',
    flightInfo: 'Return economy flights from Dhaka (DAC) with a trusted carrier.',
    foodInfo: 'Daily breakfast and dinner (buffet).',
    included: ['Umrah visa', 'Return airfare', 'Hotel accommodation', 'Ziyarah tours', 'Airport transfers', 'Experienced guide'],
    excluded: ['Personal expenses', 'Meals not mentioned', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Departure from Dhaka', description: 'Fly to Jeddah, transfer to Makkah, check in and rest.' },
      { day: 2, title: 'Umrah & Ibadah', description: 'Perform Umrah with guidance and spend time in worship at Masjid al-Haram.' },
      { day: 6, title: 'Travel to Madinah', description: 'Transfer to Madinah and visit Masjid an-Nabawi.' },
      { day: 13, title: 'Return', description: 'Transfer to Jeddah and fly back to Dhaka.' },
    ],
    highlights: ['Walking distance to Haram', 'Guided ziyarah', 'Full logistical support'],
    departures: [
      { inDays: 30, nights: 13, price: 165000, seatsTotal: 40 },
      { inDays: 60, nights: 13, price: 172000, seatsTotal: 40 },
      { inDays: 95, nights: 13, price: 178000, seatsTotal: 35 },
    ],
  },
  {
    title: 'Premium Umrah — Family',
    slug: 'premium-umrah-family',
    category: 'umrah',
    badge: 'popular',
    tier: 'premium',
    ratingCount: 32,
    specs: [
      { label: 'Makkah Hotel', value: '5★ · Haram View' },
      { label: 'Madinah Hotel', value: '5★ · 150m' },
      { label: 'Room Sharing', value: 'Double Sharing' },
      { label: 'Distance to Haram', value: 'Haram-facing' },
    ],
    shortDescription: 'Year-round Umrah for families with premium 5-star stays and full support.',
    basePrice: 245000,
    days: 12,
    nights: 11,
    destination: 'Makkah & Madinah, Saudi Arabia',
    overview: [
      'A blessed spiritual journey with premium accommodation for individuals, couples, and families.',
      'Enjoy comfortable 5-star hotels, private transport, and dedicated family support throughout your Umrah.',
    ],
    hotelInfo: '5-star hotels facing the Haram.',
    flightInfo: 'Return economy flights from Dhaka with premium carrier.',
    foodInfo: 'Full board (breakfast, lunch, dinner).',
    included: ['Umrah visa', 'Return airfare', '5-star hotels', 'Private transport', 'Ziyarah', 'Family guide'],
    excluded: ['Personal expenses', 'Laundry', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Departure', description: 'Fly to Jeddah, private transfer to Makkah.' },
      { day: 2, title: 'Umrah', description: 'Perform Umrah and settle into worship.' },
      { day: 7, title: 'Madinah', description: 'Travel to Madinah for ziyarah and prayers.' },
      { day: 11, title: 'Return', description: 'Return flight to Dhaka.' },
    ],
    highlights: ['5-star Haram-view hotels', 'Private family transport', 'Dedicated support'],
    departures: [
      { inDays: 45, nights: 11, price: 245000, seatsTotal: 30 },
      { inDays: 80, nights: 11, price: 252000, seatsTotal: 30 },
    ],
  },
  {
    title: 'Hajj Package — The Sacred Fifth Pillar',
    slug: 'hajj-sacred-fifth-pillar',
    category: 'hajj',
    featured: true,
    badge: 'top_package',
    tier: 'premium',
    ratingCount: 27,
    specs: [
      { label: 'Makkah Hotel', value: '5★ · 300m from Haram' },
      { label: 'Madinah Hotel', value: '5★ · 200m' },
      { label: 'Room Sharing', value: 'Triple Sharing' },
      { label: 'Mina & Arafah', value: 'Upgraded tents' },
    ],
    shortDescription:
      'Complete Hajj arrangements with premium accommodation, guided rituals, and dedicated support.',
    basePrice: 725000,
    days: 30,
    nights: 29,
    destination: 'Makkah, Madinah & Mina, Saudi Arabia',
    overview: [
      'Complete Hajj arrangements with premium accommodation, guided rituals, and dedicated support at every step.',
      'Every ritual of Hajj carries a deep meaning — from staying in Mina and the night at Muzdalifah to the symbolic stoning at Jamarat, our experienced team guides you throughout.',
    ],
    hotelInfo: 'Premium hotels in Makkah & Madinah; upgraded tents in Mina & Arafah.',
    flightInfo: 'Return airfare from Dhaka included.',
    foodInfo: 'Three meals daily throughout the journey.',
    included: ['Hajj visa & permits', 'Return airfare', 'Hotels & Mina/Arafah tents', 'All transfers', 'Full guidance', 'Three meals daily'],
    excluded: ['Qurbani (optional)', 'Personal expenses', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Departure to Madinah', description: 'Fly to Madinah, ziyarah of Masjid an-Nabawi.' },
      { day: 8, title: 'Travel to Makkah', description: 'Enter ihram and perform Umrah.' },
      { day: 20, title: 'Days of Hajj', description: 'Mina, Arafah, Muzdalifah, and Jamarat with full support.' },
      { day: 29, title: 'Return', description: 'Return flight to Dhaka.' },
    ],
    highlights: ['Guided rituals', 'Upgraded Mina tents', 'Experienced Hajj team'],
    departures: [{ inDays: 120, nights: 29, price: 725000, seatsTotal: 50 }],
  },
  {
    title: 'Explore Bangladesh — Sundarbans & Beyond',
    slug: 'explore-bangladesh-sundarbans',
    category: 'tour',
    featured: true,
    badge: 'best_seller',
    tier: 'standard',
    ratingCount: 64,
    specs: [
      { label: 'Hotel Class', value: 'Deluxe Cabin' },
      { label: 'Transport', value: 'AC Coach + Boat' },
      { label: 'Meals', value: 'All included' },
      { label: 'Guide', value: 'Licensed guide' },
    ],
    shortDescription:
      "Curated travel across Bangladesh's most breathtaking destinations — mangroves, hills, sea and more.",
    basePrice: 28000,
    days: 4,
    nights: 3,
    destination: 'Sundarbans & Khulna, Bangladesh',
    overview: [
      "Explore Bangladesh's most breathtaking destinations with trusted guides and a smooth travel experience.",
      'Cruise the Sundarbans mangrove forest, spot wildlife, and enjoy comfortable stays and local cuisine.',
    ],
    hotelInfo: 'Comfortable boat cabins and resort stays.',
    foodInfo: 'All meals included on the cruise.',
    included: ['Transport', 'Guided cruise', 'Accommodation', 'All meals', 'Forest permits'],
    excluded: ['Personal expenses', 'Tips'],
    itinerary: [
      { day: 1, title: 'Dhaka to Khulna', description: 'Travel to Khulna and board the cruise.' },
      { day: 2, title: 'Sundarbans', description: 'Explore the mangrove forest and wildlife spots.' },
      { day: 4, title: 'Return', description: 'Return to Dhaka.' },
    ],
    highlights: ['Mangrove cruise', 'Wildlife spotting', 'All-inclusive'],
    departures: [
      { inDays: 20, nights: 3, price: 28000, seatsTotal: 25 },
      { inDays: 40, nights: 3, price: 28000, seatsTotal: 25 },
    ],
  },
  {
    title: 'Premium Europe Sightseeing Tour',
    slug: 'premium-europe-sightseeing',
    category: 'tour',
    badge: 'popular',
    tier: 'premium',
    ratingCount: 21,
    specs: [
      { label: 'Hotel Class', value: '4★ Central' },
      { label: 'Flight Type', value: 'Economy' },
      { label: 'Visa Support', value: 'Schengen assist' },
      { label: 'Transport', value: 'Private coach' },
    ],
    shortDescription:
      'Discover the beauty of Europe with carefully planned sightseeing across famous landmarks and scenic cities.',
    basePrice: 360000,
    days: 12,
    nights: 11,
    destination: 'France, Switzerland & Italy',
    overview: [
      'Discover the beauty of Europe with our carefully planned sightseeing tours.',
      'From world-famous landmarks to charming cities and scenic destinations, we ensure a smooth, comfortable, and memorable travel experience for every traveler.',
    ],
    hotelInfo: '4-star centrally located hotels.',
    flightInfo: 'Return airfare and Schengen visa assistance.',
    foodInfo: 'Daily breakfast; select dinners.',
    included: ['Schengen visa assistance', 'Return airfare', 'Hotels', 'Guided city tours', 'Intercity transport'],
    excluded: ['Lunches', 'Personal expenses', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Arrive Paris', description: 'City tour: Eiffel Tower, Louvre, Seine cruise.' },
      { day: 5, title: 'Switzerland', description: 'Interlaken and the Alps.' },
      { day: 9, title: 'Italy', description: 'Rome and Venice highlights.' },
      { day: 12, title: 'Return', description: 'Return flight home.' },
    ],
    highlights: ['3 countries', 'Iconic landmarks', 'Guided tours'],
    departures: [{ inDays: 75, nights: 11, price: 360000, seatsTotal: 20 }],
  },
  {
    title: 'Umrah Economy — 10 Days',
    slug: 'umrah-economy-10-days',
    category: 'umrah',
    badge: 'none',
    tier: 'economy',
    ratingCount: 39,
    specs: [
      { label: 'Makkah Hotel', value: '3★ · 700m from Haram' },
      { label: 'Madinah Hotel', value: '3★ · 600m' },
      { label: 'Room Sharing', value: 'Quad Sharing' },
      { label: 'Distance to Haram', value: '700m' },
    ],
    shortDescription: 'An affordable, comfortable Umrah for a peaceful short journey.',
    basePrice: 129000,
    days: 10,
    nights: 9,
    destination: 'Makkah & Madinah, Saudi Arabia',
    overview: [
      'An affordable Umrah package that keeps every step smooth and comfortable.',
      'Ideal for a focused, short spiritual journey with all essentials arranged.',
    ],
    hotelInfo: '3-star hotels near the Haram.',
    flightInfo: 'Return economy flights from Dhaka.',
    foodInfo: 'Daily breakfast.',
    included: ['Umrah visa', 'Return airfare', 'Hotels', 'Transfers', 'Guide'],
    excluded: ['Ziyarah extras', 'Personal expenses', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Departure', description: 'Fly to Jeddah and transfer to Makkah.' },
      { day: 2, title: 'Umrah', description: 'Perform Umrah and worship.' },
      { day: 6, title: 'Madinah', description: 'Travel to Madinah.' },
      { day: 9, title: 'Return', description: 'Return flight to Dhaka.' },
    ],
    highlights: ['Budget friendly', 'Near Haram', 'All essentials'],
    departures: [
      { inDays: 25, nights: 9, price: 129000, seatsTotal: 45 },
      { inDays: 55, nights: 9, price: 133000, seatsTotal: 45 },
    ],
  },
]

/** Idempotent: upserts each package by slug (updating new fields) and seeds departures once. */
export async function seedCatalog(payload: Payload): Promise<void> {
  for (const p of PACKAGES) {
    const data = {
      title: p.title,
      slug: p.slug,
      category: p.category,
      status: 'published' as const,
      featured: p.featured ?? false,
      badge: p.badge,
      tier: p.tier,
      ratingCount: p.ratingCount,
      specs: p.specs,
      shortDescription: p.shortDescription,
      basePrice: p.basePrice,
      duration: { days: p.days, nights: p.nights },
      destination: p.destination,
      startLocation: 'Dhaka',
      overview: richText(p.overview),
      info: { hotelInfo: p.hotelInfo, flightInfo: p.flightInfo, foodInfo: p.foodInfo },
      included: p.included.map((item) => ({ item })),
      excluded: p.excluded.map((item) => ({ item })),
      itinerary: p.itinerary,
      highlights: p.highlights.map((label) => ({ label })),
      ratingAvg: 4.8,
    }

    const existing = await payload.find({
      collection: 'packages',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    let pkgId: number | string
    if (existing.totalDocs > 0) {
      const updated = await payload.update({ collection: 'packages', id: existing.docs[0].id, data })
      pkgId = updated.id
    } else {
      const created = await payload.create({ collection: 'packages', data })
      pkgId = created.id
    }

    const depCount = await payload.count({
      collection: 'departures',
      where: { package: { equals: pkgId } },
    })
    if (depCount.totalDocs === 0) {
      for (const d of p.departures) {
        await payload.create({
          collection: 'departures',
          data: {
            package: pkgId,
            departureDate: daysFromNow(d.inDays),
            returnDate: daysFromNow(d.inDays + d.nights),
            price: d.price,
            seatsTotal: d.seatsTotal,
            seatsBooked: 0,
            status: 'open',
          },
        })
      }
    }
  }
  payload.logger.info(`✔ Upserted ${PACKAGES.length} packages`)
}
