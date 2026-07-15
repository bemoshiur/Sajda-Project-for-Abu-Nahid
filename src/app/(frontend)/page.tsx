import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { Categories } from '@/components/home/Categories'
import { FeaturedPackages } from '@/components/home/FeaturedPackages'
import { WhyChoose } from '@/components/home/WhyChoose'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogPreview } from '@/components/home/BlogPreview'
import { CtaBanner } from '@/components/home/CtaBanner'
import { getPackages, getReviews, getPosts, getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [settings, featured, allPackages, reviews, posts] = await Promise.all([
    getSettings().catch(() => null),
    getPackages({ featured: true, limit: 6 }),
    getPackages({ limit: 6 }),
    getReviews({ limit: 6 }),
    getPosts(3),
  ])

  const featuredList = featured.length ? featured : allPackages
  const widgetPackages = allPackages.map((p) => ({ id: p.id, title: p.title }))
  const clientsLabel = settings?.heroStats?.clientsLabel ?? 'Trusted By 40+ Clients'

  return (
    <>
      <Hero packages={widgetPackages} clientsLabel={clientsLabel} />
      <Services />
      <Categories />
      <FeaturedPackages packages={featuredList} />
      <WhyChoose />
      <Testimonials reviews={reviews} />
      <BlogPreview posts={posts} />
      <CtaBanner />
    </>
  )
}
