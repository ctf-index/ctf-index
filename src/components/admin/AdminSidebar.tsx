"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Compass,
  CheckSquare,
  FileCheck2,
  Activity,
  Tag,
  LogOut,
  Terminal,
  ExternalLink,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  pendingCount?: number;
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      name: "Discover",
      href: "/admin/discover",
      icon: Compass,
      exact: true,
    },
    {
      name: "Review",
      href: "/admin/review",
      icon: CheckSquare,
      badge: pendingCount,
      exact: false,
    },
    {
      name: "Published",
      href: "/admin/published",
      icon: FileCheck2,
      exact: true,
    },
    {
      name: "Link Health",
      href: "/admin/link-health",
      icon: Activity,
      exact: true,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
      exact: true,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0B0D11] border-r border-[#222735] flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#222735] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/60 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-slate-100 group-hover:text-white transition-colors">
              CTF<span className="text-emerald-400">.INDEX</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Control Panel
            </span>
          </div>
        </Link>
        <Link
          href="/"
          target="_blank"
          title="Open Public Site"
          className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-[#14171F] rounded border border-transparent hover:border-[#222735] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
          Core Workflows
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all duration-150",
                isActive
                  ? "bg-[#14171F] text-emerald-400 border border-[#222735] shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#14171F]/60 border border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>

              {typeof item.badge === "number" && item.badge > 0 && (
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.2 rounded-full border transition-all",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-[#1A1E29] text-slate-400 border-[#222735] group-hover:text-slate-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Admin User Footer */}
      <div className="p-3 border-t border-[#222735] bg-[#0E1017]">
        <div className="flex items-center justify-between p-2 rounded-md bg-[#14171F] border border-[#222735]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-[#222735] flex items-center justify-center text-slate-300 shrink-0">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">
                {session?.user?.username || session?.user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                Verified Reviewer
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
