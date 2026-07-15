import Link from 'next/link'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import type { Post } from '@/payload-types'

function formatDate(value?: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function BlogPreview({ posts }: { posts: Post[] }) {
  if (!posts.length) return null
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            eyebrow="Sajda Blog"
            title="Stories & Travel Insights"
            description="Guidance, reflections and inspiration for your next journey."
          />
          <div className="grid w-full gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
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
                <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary">
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="line-clamp-3 font-body text-sm text-muted">{post.excerpt}</p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary">
                  Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <Button href="/blog" variant="outline" size="lg" className="mt-4">
            View All Posts
          </Button>
        </div>
      </Container>
    </section>
  )
}
