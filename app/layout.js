import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata = {
  metadataBase: new URL("https://neurofivesolutions.site"),
  title: {
    default: "NeuroFive Solutions — Build the stack, ship to real users",
    template: "%s | NeuroFive Solutions",
  },
  description:
    "NeuroFive is an elite builder ecosystem. Claim an active development track, ship features to real users, and grow into a core engineering role.",
  keywords: [
    "internship",
    "web development",
    "builder cohort",
    "React",
    "Next.js",
    "Supabase",
    "tech internship",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NeuroFive Solutions",
    title: "NeuroFive Solutions — Build the stack, ship to real users",
    description:
      "NeuroFive is an elite builder ecosystem. Claim an active development track, ship features to real users, and grow into a core engineering role.",
    images: [
      { url: "/NFS.png", width: 1200, height: 630, alt: "NeuroFive Solutions" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroFive Solutions — Build the stack, ship to real users",
    description:
      "NeuroFive is an elite builder ecosystem. Claim an active development track, ship features to real users, and grow into a core engineering role.",
    images: ["/NFS.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: "https://neurofivesolutions.site",
  },
  verification: {
    google: '<meta name="google-site-verification" content="frqgkQEWBtBri7OEe97KYuPAOZW07D8gWcDrGIDBFqk" />', // just the content value, not the whole tag
  },
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body suppressHydrationWarning className="flex min-h-screen flex-col bg-brand-bg font-sans text-brand-text antialiased">
        <SessionWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  )
}