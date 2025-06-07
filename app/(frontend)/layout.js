// app/layout.js

import Header from '@/components/Header';

import Footer from '@/components/Footer';
import { UserProvider } from '@/context/UserContext'; // adjust path as needed
import '../../public/css/style.css'; // Import the CSS file
import { Toaster } from 'sonner';

export const metadata = {
  title: 'GYMSTER - Gym HTML Template',
  description: 'A modern gym website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>GYMSTAR </title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="Free HTML Templates" name="keywords" />
        <meta content="Free HTML Templates" name="description" />

        {/* Favicon */}
        <link href="img/favicon.ico" rel="icon" />

        {/* Google Web Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Rubik&display=swap"
          rel="stylesheet"
        />

        {/* Icon Font Stylesheet */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link href="lib/flaticon/font/flaticon.css" rel="stylesheet" />

        {/* Libraries Stylesheet */}
        <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />

        {/* Customized Bootstrap Stylesheet */}
        <link href="css/bootstrap.min.css" rel="stylesheet" />

        {/* Template Stylesheet */}
        <link href="css/style.css" rel="stylesheet" />
      </head>

      <body>
        <UserProvider>
        <Toaster position="top-center" richColors /> {/* ✅ ADD THIS */}
          <Header />
          {children}

          <Footer />
          <a href="#" className="btn btn-dark py-3 fs-4 back-to-top">
            <i className="bi bi-arrow-up"></i>
          </a>
        </UserProvider>
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/counterup/counterup.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script>
      </body>

    </html>
  );
}
