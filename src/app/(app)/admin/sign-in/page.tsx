"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Terminal, Shield, Lock, User, AlertCircle } from "lucide-react";

export default function AdminSignInPage() {
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please provide your admin username/email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: identifier.trim(),
        password: password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/review");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-sm">
            <Terminal className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            CTF<span className="text-emerald-400">.INDEX</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access the curator control panel and review queue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#14171F] border border-[#222735] rounded-lg p-6 shadow-xl space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username or Email
              </label>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@ctfindex.local"
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              <Shield className="w-4 h-4 mr-1.5" />
              Authenticate
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500 font-mono">
          Authorized personnel only. Sessions are cryptographically signed.
        </p>
      </div>
    </div>
  );
}