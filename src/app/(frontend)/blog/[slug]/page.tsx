import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Clock, User } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { getPostBySlug } from '@/lib/data'

export const dynamic = 'force-dynamic'

function formatDate(value?: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const date = formatDate(post.publishedAt)

  return (
    <article className="bg-white py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary transition hover:gap-2.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-ui text-xs text-muted-2">
            {post.category ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {post.category}
              </span>
            ) : null}
            {date ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> {date}
              </span>
            ) : null}
            {post.readTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {post.readTime} min read
              </span>
            ) : null}
            {post.author ? (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {post.author}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-3xl leading-tight font-bold text-navy sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-4 font-body text-lg text-muted">{post.excerpt}</p>
          ) : null}

          <RichText data={post.body} className="mt-8" />
        </div>
      </Container>
    </article>
  )
}
