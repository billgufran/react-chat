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

export default function UserMenu({ userPresent }: { userPresent: boolean }) {
  const user = auth.currentUser;
  if (!userPresent) return null;

  const avatarUrl = user?.photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl} alt={user?.displayName || "avatar"} />
            <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={avatarUrl} alt={user?.displayName || "avatar"} />
              <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user?.displayName || "User"}</div>
              <div className="truncate text-xs text-muted-foreground">
                {user?.email || "Signed in"}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={firebaseSignOut} className="gap-2">
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
