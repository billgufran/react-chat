"use client";

import { Button } from "@/components/ui/button";
import { LogIn, MessageSquareText } from "lucide-react";
import { auth, firebaseSignInWithPopup } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInCard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      await firebaseSignInWithPopup();
      const idToken = await auth.currentUser?.getIdToken(true);
      if (idToken) {
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <MessageSquareText className="size-5 text-primary" />
        <span className="text-base font-semibold">Welcome to ReactChat</span>
      </div>
      <Button onClick={signIn} disabled={loading} className="w-full">
        <LogIn className="mr-2 size-4" />
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Sign in to start chatting.
      </p>
    </div>
  );
}
