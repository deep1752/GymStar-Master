'use client';

import Link from 'next/link';

export default function AdminFooter() {
    return (
        <footer className="adminFooter">
            <div className="footerContent">
                <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <div className="footerLinks">
                    <Link href="/admin/privacy">Privacy Policy</Link>
                    <Link href="/admin/terms">Terms of Service</Link>
                    <Link href="/admin/help">Help Center</Link>
                </div>
            </div>
        </footer>

    );
}



