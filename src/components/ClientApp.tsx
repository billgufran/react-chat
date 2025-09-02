"use client";

import { useState } from "react";
import { auth, firebaseSignInWithPopup } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { LogIn, MessageSquareText } from "lucide-react";
import UserMenu from "./UserMenu";
import ChatRoom from "./ChatRoom";

export default function ClientApp() {
  const [user] = useAuthState(auth);

  return (
    <div className="mx-auto h-svh w-full max-w-screen-sm md:max-w-3xl">
      <Header userPresent={!!user} />
      <section className="flex h-[calc(100svh-64px)] flex-col bg-background">
        {user ? (
          <ChatRoom />
        ) : (
          <div className="flex h-full items-center justify-center">
            <SignIn />
          </div>
        )}
      </section>
    </div>
  );
}

function Header({ userPresent }: { userPresent: boolean }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <MessageSquareText className="size-5 text-primary" />
        <span className="text-base font-semibold tracking-tight">ReactChat</span>
      </div>
      <UserMenu userPresent={userPresent} />
    </header>
  );
}

function SignIn() {
  const [loading, setLoading] = useState(false);
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await firebaseSignInWithPopup();
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
      <Button onClick={signInWithGoogle} disabled={loading} className="w-full">
        <LogIn className="mr-2 size-4" />
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">Sign in to start chatting.</p>
    </div>
  );
}

