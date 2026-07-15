import type { Payload } from 'payload'

const REVIEWS = [
  {
    authorName: 'Muhammad Alim Khandakar',
    rating: 5,
    title: 'A wonderful Hajj experience',
    body: "A wonderful Hajj experience with Sajda. Everything was well managed, and the team's support made our journey comfortable, meaningful, and worry-free.",
    featured: true,
  },
  {
    authorName: 'Ayesha Rahman',
    rating: 5,
    title: 'Peaceful Umrah journey',
    body: 'The Umrah package was perfectly organized. Hotels were close to the Haram and the guidance was excellent throughout.',
    featured: true,
  },
  {
    authorName: 'Tanvir Hasan',
    rating: 5,
    title: 'Unforgettable Europe tour',
    body: 'Smooth, comfortable and memorable. Every detail was handled with care and professionalism. Highly recommended.',
    featured: true,
  },
  {
    authorName: 'Farhana Akter',
    rating: 4,
    title: 'Great Sundarbans trip',
    body: 'Well-planned cruise and friendly guides. The wildlife spotting was a highlight for the whole family.',
    featured: false,
  },
]

export async function seedReviews(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'reviews' })
  if (existing.totalDocs > 0) {
    payload.logger.info(`✔ Reviews already seeded (${existing.totalDocs})`)
    return
  }
  for (const r of REVIEWS) {
    await payload.create({ collection: 'reviews', data: { ...r, status: 'approved' } })
  }
  payload.logger.info(`✔ Seeded ${REVIEWS.length} reviews`)
}
