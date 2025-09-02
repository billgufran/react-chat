import { auth } from "@/lib/firebase";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatroomHeader() {
  return (
    <div className="flex items-center gap-3 border-b px-3 py-2">
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage
            src={
              auth.currentUser?.photoURL ||
              "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"
            }
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <div className="text-sm font-medium">General Chat</div>
          <div className="text-xs text-muted-foreground">Everyone</div>
        </div>
      </div>
    </div>
  );
}
