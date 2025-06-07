'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/AdminContext';
import './globals.css';
import AdminHeader from '@/components/AdminHeader';
import AdminFooter from '@/components/AdminFooter';
import { Toaster } from 'sonner';
import AdminWithAuth from '@/components/AdminWithAuth';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  // ✅ Apply auth check only to protected routes, not the login page
  const ProtectedChildren = !isLoginPage ? AdminWithAuth(() => children) : () => children;

  return (
    <html lang="en">
      <body className={!isLoginPage ? "admin-layout" : ""}>
        <AdminProvider>
          <Toaster richColors position="top-center" />
          {isLoginPage ? (
            children
          ) : (
            <div className="admin-dashboard-container">
              <div className="sidebar">
                <div className="logo">Admin Panel</div>
                <nav>
                  <ul>
                    <li><Link href="/admin/dashbord">Dashboard</Link></li>
                    <li><Link href="/admin/user">Customers</Link></li>
                    <li><Link href="/admin/membership">Membership Plans</Link></li>
                    <li><Link href="/admin/class">Classes</Link></li>
                    <li><Link href="/admin/trainers">Trainers</Link></li>
                    <li><Link href="/admin/sliders">Sliders</Link></li>
                  </ul>
                </nav>
              </div>

              <div className="main-content-wrapper">
                <AdminHeader />
                <main className="admin-main-content">
                  <ProtectedChildren />
                </main>
                <AdminFooter />
              </div>
            </div>
          )}
        </AdminProvider>
      </body>
    </html>
  );
}
