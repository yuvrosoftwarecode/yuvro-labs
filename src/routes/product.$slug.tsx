import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { ProductGlyph } from "@/components/site/ProductGlyph";
import { findProductItem } from "@/lib/productMenu";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const found = findProductItem(params.slug);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.title} — Yuvro Labs` },
          { name: "description", content: loaderData.item.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.item.title} — Yuvro Labs` },
          { property: "og:description", content: loaderData.item.description.slice(0, 155) },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Unavailable — Yuvro Labs" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { group, item } = Route.useLoaderData();
  return (
    <div className="min-h-screen text-[#0A0A0A] antialiased" style={{ background: "#FAFAF8" }}>
      <SiteNav />
      <main className="mx-auto max-w-[820px] px-6 py-16">
        <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A867E]">
          <Link to="/product" className="hover:text-[#0A0A0A]">Product</Link>
          <span className="text-[#D8D5CE]">/</span>
          <span>{group.heading}</span>
        </nav>

        <div className="mt-6 flex items-start gap-3">
          <ProductGlyph name={item.glyph} className="mt-3 text-[#8A867E]" />
          <h1 className="text-4xl leading-[1.1] tracking-tight">{item.title}</h1>
        </div>

        {item.claim && (
          <p className="mt-6 border-l-2 pl-4 text-[15px] text-[#0A0A0A]" style={{ borderColor: "#F5A623" }}>{item.claim}</p>
        )}

        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#3A3A38]">{item.description}</p>

        {item.bullets && (
          <ul className="mt-8 grid gap-px border border-[#E8E6E1] bg-[#E8E6E1] sm:grid-cols-2">
            {item.bullets.map((b) => (
              <li key={b} className="bg-white px-4 py-3 text-[13.5px] text-[#2A2A28]">{b}</li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-[#E8E6E1] pt-8">
          <Link to="/auth" search={{ tab: "signup" }} className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ background: "#F5A623" }}>
            Start free trial
          </Link>
          <Link to="/pricing" className="text-sm text-[#6B6B6B] hover:text-[#0A0A0A]">See pricing</Link>
        </div>
      </main>
    </div>
  );
}
