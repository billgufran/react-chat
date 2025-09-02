import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Message } from "@/types/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatMessage({ message }: { message: Message }) {
  const { text, uid, photoURL, displayName, createdAt } = message;
  const isMe = auth.currentUser && uid === auth.currentUser.uid;

  const timestamp = createdAt && "toDate" in createdAt ? createdAt.toDate() : undefined;
  const timeLabel = timestamp
    ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(timestamp)
    : "";

  return (
    <div className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <Avatar className="size-7">
          <AvatarImage
            src={photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"}
          />
          <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn("group max-w-[75%]", isMe ? "items-end text-right" : "items-start text-left")}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-[15px] leading-snug shadow-sm",
            isMe
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          {text}
        </div>
        <div className="mt-1 text-[11px] leading-none text-muted-foreground">{timeLabel}</div>
      </div>

      {isMe && (
        <Avatar className="size-7">
          <AvatarImage
            src={
              auth.currentUser?.photoURL ||
              photoURL ||
              "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"
            }
          />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
