"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Terminal, Shield, Lock, User, Mail, AlertCircle, Key } from "lucide-react";

function SignUpForm() {
  const searchParams = useSearchParams();
  const inviteTokenFromUrl = searchParams.get("invite") || "";

  const [token, setToken] = React.useState(inviteTokenFromUrl);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (inviteTokenFromUrl) {
      setToken(inviteTokenFromUrl);
    }
  }, [inviteTokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !username.trim() || !email.trim() || !password) {
      setError("All fields are required to register an admin account");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register admin account");
      }

      router.push("/admin/sign-in");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#14171F] border border-[#222735] rounded-lg p-6 shadow-xl space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Invite Token
          </label>
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="UUID invite token"
            leftIcon={<Key className="w-4 h-4" />}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Username
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="secops_curator"
            leftIcon={<User className="w-4 h-4" />}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="curator@team.org"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
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

        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
          <Shield className="w-4 h-4 mr-1.5" />
          Create Account
        </Button>
      </form>
    </div>
  );
}

export default function AdminSignUpPage() {
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
            Accept administrator invite & create reviewer credentials
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500 text-center py-8">Loading signup form...</div>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
