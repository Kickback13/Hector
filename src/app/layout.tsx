import type { Metadata, Viewport } from "next";
import "@fontsource-variable/jost";
import "./globals.css";

const description =
  "Pressure washing, house & siding soft wash, deck & fence restoration, trash bin cleaning and commercial storefront cleaning in La Jolla & San Diego. Locally owned, free quotes — call (559) 653-2810.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.townmadecleaning.com"),
  title: "Pressure Washing San Diego & La Jolla | Town Made Cleaning",
  description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Town Made Cleaning",
    title: "Pressure Washing San Diego & La Jolla | Town Made Cleaning",
    description,
    url: "https://www.townmadecleaning.com/",
    images: [{ url: "/img/hero-action.jpg", width: 1344, height: 752 }],
  },
  icons: { icon: "/icon.svg" },
  other: { "geo.region": "US-CA", "geo.placename": "La Jolla, San Diego" },
};

export const viewport: Viewport = {
  themeColor: "#04141d",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.townmadecleaning.com/#business",
  name: "Town Made Cleaning",
  url: "https://www.townmadecleaning.com/",
  telephone: "+1-559-653-2810",
  image: "https://www.townmadecleaning.com/img/hero-action.jpg",
  description:
    "Locally owned pressure washing and exterior cleaning company serving La Jolla and the greater San Diego area.",
  areaServed: ["La Jolla", "San Diego"],
  address: { "@type": "PostalAddress", addressLocality: "San Diego", addressRegion: "CA", addressCountry: "US" },
  makesOffer: [
    "Pressure Washing",
    "House & Siding Soft Wash",
    "Deck & Fence Cleaning",
    "Commercial & Storefront Cleaning",
    "Trash Bin Cleaning",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
