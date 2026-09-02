import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { LayoutWrapper } from '@/components/storefront/LayoutWrapper';
import { TrackingScripts } from '@/components/storefront/TrackingScripts';
import '@/styles/globals.css';
import '@/styles/homepage.css';
import '@/styles/collections-theme.css';
import '@/styles/single-product.css';
import '@/styles/shop-page.css';
import '@/styles/storefront.css';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: 'Daroodi | Bespoke Luxury Embroidered Prince Coats & Haute Couture',
  description:
    'Heritage South Asian haute couture maison. Handcrafted made-to-measure zardozi prince coats, velvet tuxedos, and fraternal ceremonial regalia with pure 24k gold bullion. Fully-insured DHL Express worldwide delivery.',
  keywords: [
    'Prince Coat',
    'Bespoke Sherwani',
    'Zardozi Hand Embroidery',
    'Luxury Velvet Tuxedo',
    'South Asian Haute Couture',
    'Daroodi Lahore Atelier',
    'Groom Wedding Coat',
    'Bespoke Menswear London Dubai'
  ],
  metadataBase: new URL('https://daroodi.com'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  alternates: {
    canonical: 'https://daroodi.com',
  },
  openGraph: {
    title: 'Daroodi | Bespoke Luxury Embroidered Prince Coats & Haute Couture',
    description: 'Handcrafted made-to-order embroidered prince coats, blazers, and luxury formal pieces stitched by master artisans in Pakistan.',
    url: 'https://daroodi.com',
    siteName: 'Daroodi Luxury Atelier',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daroodi | Bespoke Luxury Embroidered Prince Coats',
    description: 'Handcrafted made-to-order embroidered prince coats, blazers, and luxury formal pieces.',
  },
  other: {
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore',
    'geo.position': '31.5204;74.3587',
    'ICBM': '31.5204, 74.3587',
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://daroodi.com/#organization',
      'name': 'Daroodi Luxury Atelier',
      'url': 'https://daroodi.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://daroodi.com/uploads/2026/05/cropped-Droodi-Logo.jpg',
        'width': '300',
        'height': '300'
      },
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'telephone': '+923001215532',
          'contactType': 'customer support / bespoke consultant',
          'areaServed': ['GB', 'AE', 'US', 'PK', 'CA', 'AU', 'EU'],
          'availableLanguage': ['English', 'Urdu']
        }
      ],
      'sameAs': [
        'https://instagram.com/officialdaroodi',
        'https://facebook.com/17UwBqLvC2',
        'https://tiktok.com/@daroodi.official7',
        'https://youtube.com/@daroodiofficial'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': 'https://daroodi.com/#website',
      'url': 'https://daroodi.com',
      'name': 'Daroodi Bespoke Luxury',
      'publisher': {
        '@id': 'https://daroodi.com/#organization'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://daroodi.com/shop?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'ClothingStore',
      '@id': 'https://daroodi.com/#store',
      'name': 'Daroodi Haute Couture Atelier',
      'image': 'https://daroodi.com/uploads/2026/05/hero-coat.jpg',
      'telephone': '+923001215532',
      'priceRange': '£350 - £2800',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lahore',
        'addressRegion': 'Punjab',
        'addressCountry': 'PK'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 31.5204,
        'longitude': 74.3587
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/uploads/2026/06/Mens-Premium-Prince-Coat-2.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <TrackingScripts />
          <LayoutWrapper>{children}</LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
