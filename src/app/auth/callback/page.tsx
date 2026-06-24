"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async () => {
        const seen = localStorage.getItem("romman_onboarded");
        router.replace(seen ? "/home" : "/onboarding");
      }).catch(() => {
        router.replace("/signin");
      });
    } else {
      router.replace("/home");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f0eb" }}>
      <p className="text-[13px] uppercase tracking-[0.2em]" style={{ color: "#9b8070" }}>signing in…</p>
    </div>
  );
}
