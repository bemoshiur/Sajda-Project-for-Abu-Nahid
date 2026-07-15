import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/utils'

/** Renders Payload Lexical richText content with prose styling. */
export function RichText({
  data,
  className,
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data) return null
  return (
    <div
      className={cn(
        'flex flex-col gap-4 font-body text-base leading-relaxed text-ink/80 [&_a]:text-primary [&_a]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-navy [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-navy',
        className,
      )}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
