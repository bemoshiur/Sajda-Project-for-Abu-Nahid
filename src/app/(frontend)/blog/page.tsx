import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { getPosts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stories, guidance and travel insights for your next Tour, Hajj or Umrah journey.',
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getPosts(50)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-white to-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
        <Container className="relative py-14 text-center lg:py-20">
          <span className="font-ui text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            Sajda Blog
          </span>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] font-bold text-navy sm:text-5xl">
            Stories &amp; Travel Insights
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-muted">
            Guidance, reflections and inspiration for your next journey.
          </p>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container>
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 rounded-3xl border border-line bg-white p-6 transition hover:shadow-lg hover:shadow-navy/5"
                >
                  <div className="flex items-center gap-2 font-ui text-xs text-muted-2">
                    {post.category ? (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                        {post.category}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-navy group-hover:text-primary">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="line-clamp-3 font-body text-sm text-muted">{post.excerpt}</p>
                  ) : null}
                  <span className="mt-auto inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary">
                    Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-12 text-center">
              <h2 className="font-display text-xl font-bold text-navy">No posts yet</h2>
              <p className="mt-2 font-body text-sm text-muted">
                We&apos;re working on new stories and travel insights. Please check back soon.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
