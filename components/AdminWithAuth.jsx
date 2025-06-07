"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const AdminWithAuth = (WrappedComponent) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
      // Check auth synchronously right after mount
      const token = localStorage.getItem("admin_token");
      const role = localStorage.getItem("admin_role");

      if (!token || role !== "admin") {
        toast.error("Unauthorized access");
        router.replace("/admin"); // replace instead of push to prevent back navigation
        return;
      }

      setAuthChecked(true);
    }, [router]);

    // Don't render anything until auth is verified
    if (!authChecked) {
      return null;
    }

    // Only render if authenticated
    return <WrappedComponent {...props} />;
  };
};

export default AdminWithAuth;