import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getRelated, products } from "@/data/products";
import { getCategory } from "@/data/categories";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductCard } from "@/components/shop/ProductCard";
import { Breadcrumb } from "@/components/sections/Shared";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { formatPack } from "@/lib/format";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const pack = formatPack(p.packQuantity, p.bottleVolume);
  return {
    title: `${p.name} ${pack}`,
    description: `${p.name} (${pack}, ${p.packageType} ${p.returnType}) bei Schake's Bier bestellen – Getränkelieferung in Bayreuth und Umgebung, Leergut nehmen wir mit.`,
    alternates: { canonical: `/sortiment/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = getRelated(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    category: category.name,
    description: `${product.variety}, ${formatPack(product.packQuantity, product.bottleVolume)}, ${product.packageType} ${product.returnType}`,
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price.toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: site.name },
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pb-24 pt-[100px] lg:pt-[120px]">
        <div className="container-x">
          <Breadcrumb items={[{ href: "/sortiment", label: "Sortiment" }, { href: `/sortiment?kategorie=${category.slug}`, label: category.name }, { label: product.name }]} />
          <div className="mt-8 lg:mt-10">
            <ProductDetail product={product} />
          </div>
        </div>
      </section>
      <section className="border-t border-line bg-paper py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Passt dazu" title="Das könnte auch passen." size="3" action={<ArrowLink href={`/sortiment?kategorie=${category.slug}`}>Mehr {category.name}</ArrowLink>} />
          <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {related.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
