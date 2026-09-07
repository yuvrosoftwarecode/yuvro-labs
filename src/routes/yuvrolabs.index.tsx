import { createFileRoute } from '@tanstack/react-router'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'

export const Route = createFileRoute('/yuvrolabs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen text-[#1B1F23] antialiased" style={{ background: "#FAFAFA" }}>
      <SiteNav />
      <main className="flex min-h-[calc(100vh-4rem-73px)] flex-col items-center justify-center px-6 text-center">
        <h1 className="yvr-serif text-[34px] font-normal tracking-[-0.015em] text-[#0A0A0A] lg:text-[42px]">
          Coming soon
        </h1>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6B6B6B]">
          We're building this page. Check back shortly.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
