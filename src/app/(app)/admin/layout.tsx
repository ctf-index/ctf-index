"use client";

import * as React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { apiClient } from "@/lib/api-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingCount, setPendingCount] = React.useState<number>(0);

  // Poll or fetch pending count periodically or on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadCount() {
      try {
        const res = await apiClient.getAdminWalkthroughs("pending");
        if (isMounted && res.walkthroughs) {
          setPendingCount(res.walkthroughs.length);
        }
      } catch {
        // Handled silently for sidebar badge
      }
    }

    loadCount();
    const interval = setInterval(loadCount, 15000); // 15s refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#0B0D11] text-slate-100 overflow-hidden font-sans">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar pendingCount={pendingCount} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
