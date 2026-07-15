import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'coral' | 'ghost' | 'white'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/25',
  coral: 'bg-coral text-white hover:brightness-95',
  outline: 'border border-line text-navy hover:border-primary hover:text-primary',
  ghost: 'text-navy hover:bg-surface-2',
  white: 'bg-white text-navy hover:bg-surface-2 shadow-sm',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-colors disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

type ButtonAsButton = ComponentProps<'button'> & {
  href?: undefined
  variant?: Variant
  size?: Size
  children: ReactNode
}
type ButtonAsLink = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if ('href' in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props as ButtonAsButton
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
