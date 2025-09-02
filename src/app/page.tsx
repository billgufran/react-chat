"use client";

import ChatRoom from "@/components/ChatRoom";
import SignInCard from "@/components/SignInCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function Page() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user) {
    return <ChatRoom />;
  }

  return (
    <div className="flex h-full items-center justify-center">
      <SignInCard />
    </div>
  );
}
