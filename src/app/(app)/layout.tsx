import Link from "next/link";
import { Terminal, Shield, Sparkles } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#222735] bg-[#0B0D11]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/60 transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-wide text-slate-100 group-hover:text-white transition-colors">
              CTF<span className="text-emerald-400">.INDEX</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Search
            </Link>
            <Link
              href="/admin/review"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#14171F] hover:bg-[#1A1E29] text-slate-300 hover:text-white border border-[#222735] hover:border-[#353D52] transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Queue</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main View */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <footer className="border-t border-[#222735] py-8 text-center text-xs text-slate-500 bg-[#0E1017]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-mono">
            CTF-INDEX &bull; Verified CTF Walkthroughs & Preserved Exploit Knowledge Base
          </p>
          <p className="text-[11px] text-slate-600">
            All writeup snapshots automatically indexed and preserved via the Internet Archive Wayback Machine.
          </p>
        </div>
      </footer>
    </div>
  );
}
