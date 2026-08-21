import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { ProductGlyph } from "@/components/site/ProductGlyph";
import { productGroups } from "@/lib/productMenu";

export const Route = createFileRoute("/product/")({
  head: () => ({
    meta: [
      { title: "The Yuvro Labs Product — Engineering Hiring System" },
      { name: "description", content: "Engineering Simulations, Knowledge Assessments, Vitarka AI interviews, hiring intelligence, follow-ups and reports — one system to evaluate engineers." },
      { property: "og:title", content: "The Yuvro Labs Product — Engineering Hiring System" },
      { property: "og:description", content: "Evaluate, verify, understand, follow up and hire engineers with evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductIndex,
});

function ProductIndex() {
  return (
    <div className="min-h-screen text-[#0A0A0A] antialiased" style={{ background: "#FAFAF8" }}>
      <SiteNav />
      <main className="mx-auto max-w-[1120px] px-6 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A867E]">Product</p>
        <h1 className="mt-4 max-w-2xl text-4xl leading-[1.1] tracking-tight md:text-5xl">
          A complete engineering hiring system, not a set of AI features.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#6B6B6B]">
          Evaluate engineers through real work, verify the evidence behind every score, understand technical ability,
          follow up automatically and keep the hiring decision with your recruiters.
        </p>

        <div className="mt-14 space-y-12">
          {productGroups.map((g) => (
            <section key={g.id}>
              <div className="flex items-baseline gap-3 border-b border-[#E8E6E1] pb-3">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em]">{g.heading}</h2>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#B4B0A8]">{g.caption}</span>
              </div>
              <div className="grid gap-x-10 gap-y-7 pt-6 md:grid-cols-2">
                {g.items.map((it) => (
                  <Link key={it.slug} to="/product/$slug" params={{ slug: it.slug }} className="group flex gap-3">
                    <ProductGlyph name={it.glyph} className="mt-1 shrink-0 text-[#8A867E] group-hover:text-[#0A0A0A]" />
                    <span>
                      <span className="block text-[15px] group-hover:underline">{it.title}</span>
                      <span className="mt-1 block max-w-md text-[13px] leading-relaxed text-[#6B6B6B]">{it.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
