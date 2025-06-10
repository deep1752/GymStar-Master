// ❌ No 'use client' here — this file must remain a Server Component

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserProvider } from '@/context/UserContext';
import '../../public/css/style.css'; // Local CSS
import { Toaster } from 'sonner';
import ScriptLoader from '@/components/ScriptLoader'; // New client-side component

export const metadata = {
  title: 'GYMSTER - Gym HTML Template',
  description: 'A modern gym website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Free HTML Templates" />
        <meta name="description" content="Free HTML Templates" />
        <link rel="icon" href="/img/favicon.ico" />

        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/lib/owlcarousel/assets/owl.carousel.min.css" />
        <link rel="stylesheet" href="/lib/flaticon/font/flaticon.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css" />


        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Rubik&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <UserProvider>
          <Toaster position="top-center" richColors />
          <Header />
          {children}
          <Footer />
          <a href="#" className="btn btn-dark py-3 fs-4 back-to-top">
            <i className="bi bi-arrow-up"></i>
          </a>
          <ScriptLoader />
        </UserProvider>
      </body>
    </html>
  );
}
