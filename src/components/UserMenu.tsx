"use client";

import { auth, firebaseSignOut } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function UserMenu() {
  const [user, loading] = useAuthState(auth);

  if (loading || !user) return null;

  const avatarUrl = user?.photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <Avatar className="size-8">
            {!loading && (
              <AvatarImage src={avatarUrl} alt={user?.displayName || "avatar"} />
            )}
            <AvatarFallback>{loading ? "" : user?.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              {!loading && (
                <AvatarImage src={avatarUrl} alt={user?.displayName || "avatar"} />
              )}
              <AvatarFallback>{loading ? "" : user?.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{loading ? "" : user?.displayName || "User"}</div>
              <div className="truncate text-xs text-muted-foreground">
                {loading ? "" : user?.email || "Signed in"}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await firebaseSignOut();
          }}
          className="gap-2"
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
