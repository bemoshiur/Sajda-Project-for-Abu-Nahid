import type { Payload } from 'payload'
import { richText, daysFromNow } from './lib'

const POSTS = [
  {
    title: 'We Provide You Best Europe Sightseeing Tours',
    slug: 'best-europe-sightseeing-tours',
    excerpt:
      'Discover the beauty of Europe with our carefully planned sightseeing tours — landmarks, cities and scenic destinations.',
    category: 'Tour',
    readTime: 5,
    body: [
      'Discover the beauty of Europe with our carefully planned sightseeing tours. From world-famous landmarks to charming cities and scenic destinations, we ensure a smooth, comfortable, and memorable travel experience for every traveler.',
      'Our experienced guides and thoughtfully designed itineraries let you focus on the experience while we handle the logistics.',
    ],
  },
  {
    title: 'The Day of Arafah: A Powerful Moment of Hajj',
    slug: 'day-of-arafah-hajj',
    excerpt:
      'Standing among millions of pilgrims, the Day of Arafah is one of the most powerful moments of the Hajj journey.',
    category: 'Hajj',
    readTime: 4,
    body: [
      'The Day of Arafah was one of the most powerful and unforgettable moments of the Hajj journey. Standing among millions of pilgrims, raising hands in prayer, asking Allah for forgiveness and blessings, creates an emotional experience that words cannot fully describe.',
      'With proper guidance and support, every step of Hajj can be completed smoothly and confidently.',
    ],
  },
  {
    title: 'Planning a Peaceful Umrah: What to Know',
    slug: 'planning-a-peaceful-umrah',
    excerpt:
      'From visa to ziyarah, a little planning goes a long way toward a smooth and spiritually meaningful Umrah.',
    category: 'Umrah',
    readTime: 6,
    body: [
      'A peaceful Umrah begins with good planning — visa processing, flights, accommodation close to the Haram, and reliable transport.',
      'Having an experienced and trusted team allows you to focus completely on your worship and spiritual experience.',
    ],
  },
]

export async function seedPosts(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'posts' })
  if (existing.totalDocs > 0) {
    payload.logger.info(`✔ Posts already seeded (${existing.totalDocs})`)
    return
  }
  for (const [i, p] of POSTS.entries()) {
    await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        category: p.category,
        readTime: p.readTime,
        author: 'Sajda Team',
        status: 'published',
        publishedAt: daysFromNow(-i * 7),
        body: richText(p.body),
      },
    })
  }
  payload.logger.info(`✔ Seeded ${POSTS.length} blog posts`)
}
