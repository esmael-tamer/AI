import { SiteHeaderProduct } from "./_components/site-header-product"
import { HeroProduct } from "./_components/hero-product"
import { FeaturesProduct } from "./_components/features-product"
import { PricingProduct } from "./_components/pricing-product"
import { FooterProduct } from "./_components/footer-product"
import Script from "next/script"

export const dynamic = "force-static"

export const metadata = {
  title: "3D Product Rendering | Studio-Quality CGI by Skitbit",
  description:
    "Photorealistic 3D product renders for e-commerce, ads and brand campaigns. No studio needed — delivered in 48 hours.",
  alternates: {
    canonical: "https://theskitbit.com/3d-product-rendering",
  },
  openGraph: {
    title: "3D Product Rendering | Studio-Quality CGI by Skitbit",
    description:
      "Photorealistic 3D product renders for e-commerce, ads and brand campaigns. No studio needed — delivered in 48 hours.",
    url: "https://theskitbit.com/3d-product-rendering",
    type: "website",
  },
}

export default function Page() {
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://theskitbit.com/3d-product-rendering",
    name: "3D Product Rendering | Studio-Quality CGI by Skitbit",
    description:
      "Photorealistic 3D product renders for e-commerce, ads and brand campaigns. No studio needed — delivered in 48 hours.",
    url: "https://theskitbit.com/3d-product-rendering",
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeaderProduct />
        <HeroProduct />
        <FeaturesProduct />
        <PricingProduct />
        <FooterProduct />
      </main>

      <Script
        id="product-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
