"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";

const AdminWithAuth = ({ children }) => {
  const router = useRouter();
  const { isAdminAuthenticated, loading, isLoggingOut } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdminAuthenticated && !isLoggingOut) {
      toast.error("Unauthorized access");
      router.replace("/admin");
    }
  }, [loading, isAdminAuthenticated, router, isLoggingOut]);

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!isAdminAuthenticated) return null;

  return children;
};

export default AdminWithAuth;