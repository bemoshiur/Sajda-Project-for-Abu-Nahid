import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Let&apos;s make your next journey amazing
            </h2>
            <p className="max-w-xl font-body text-white/70">
              Tell us where your heart wants to go. Our team will craft the right package and
              guide you from booking to your safe return.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/contact" variant="white" size="lg">
                Contact Us
              </Button>
              <Button href="/packages" variant="primary" size="lg">
                Browse Packages
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
