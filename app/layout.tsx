import type { Metadata } from "next";
import { Marcellus, PT_Sans } from "next/font/google";
import "./globals.css";

const googleTagManagerId = "GTM-T2XZHHNT";
const googleTagManagerBootstrap = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagManagerId}');`;

const marcellus = Marcellus({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const ptSans = PT_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://iv-drip.drnishitaranka.in/";
const title = "Skin Booster & IV Drips Treatments Hyderabad | Dr. Nishita Ranka";
const description =
  "Skin boosters with complimentary IV wellness in Hyderabad, SKINVIVE™, RD1 & Profhilo® paired with doctor-led IV drips. Personalised protocols. Book now.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Dr. Nishita's Clinic",
  title,
  description,
  keywords: [
    "Skin Boosters Hyderabad",
    "SKINVIVE Hyderabad",
    "Profhilo Hyderabad",
    "IV Drip Hyderabad",
    "IV Wellness Banjara Hills",
    "Dr. Nishita Ranka",
  ],
  authors: [{ name: "Dr. Nishita Ranka", url: "https://drnishitaranka.com/" }],
  creator: "Dr. Nishita Ranka",
  publisher: "Dr. Nishita's Clinic",
  category: "health",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "100x98" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Dr. Nishita's Clinic",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/brand/dr-nishita.jpg",
        width: 1200,
        height: 1500,
        alt: "Dr. Nishita Ranka, dermatologist and founder of Dr. Nishita's Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/dr-nishita.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{ __html: googleTagManagerBootstrap }}
        />
      </head>
      <body className={marcellus.variable + " " + ptSans.variable}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
