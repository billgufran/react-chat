"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { auth, db, firebaseSignInWithPopup, firebaseSignOut } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  query as fsQuery,
  orderBy,
  limit,
  type DocumentData,
  type Query,
  type Timestamp,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ImageIcon,
  Mic,
  Paperclip,
  SendHorizonal,
  Smile,
  LogOut,
  LogIn,
  MessageSquareText,
} from "lucide-react";

type Message = {
  id: string;
  text: string;
  uid: string;
  photoURL?: string | null;
  displayName?: string | null;
  createdAt?: Timestamp | null;
};

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

function UserMenu({ userPresent }: { userPresent: boolean }) {
  const user = auth.currentUser;
  if (!userPresent) return null;

  const avatarUrl = user?.photoURL ||
    "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat";

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
              <div className="truncate text-sm font-medium">
                {user?.displayName || "User"}
              </div>
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
      <p className="text-center text-xs text-muted-foreground">
        Sign in to start chatting.
      </p>
    </div>
  );
}

function ChatRoom() {
  const recentChat = useRef<HTMLDivElement | null>(null);
  const messagesRef = collection(db, "messages");
  const q: Query<DocumentData> = fsQuery(messagesRef, orderBy("createdAt"), limit(100));
  const [_data, loading, _error, snapshot] = useCollectionData<DocumentData>(q);
  const messages: Message[] = useMemo(
    () =>
      snapshot?.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })) ?? [],
    [snapshot]
  );
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    if (recentChat.current) {
      recentChat.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auth.currentUser || !formValue.trim()) return;
    const { uid, photoURL, displayName } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue.trim(),
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });
    setFormValue("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={auth.currentUser?.photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <div className="text-sm font-medium">General Chat</div>
            <div className="text-xs text-muted-foreground">Everyone</div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          {loading && (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading messages…</div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={recentChat} />
        </div>
      </ScrollArea>

      <Separator />

      <MessageComposer
        value={formValue}
        onChange={setFormValue}
        onSend={sendMessage}
      />
    </div>
  );
}

function MessageComposer({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: (e?: React.FormEvent) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form onSubmit={onSend} className="flex items-end gap-2 p-3">
      <TooltipProvider>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <Paperclip className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <ImageIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Photo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        className="max-h-36 min-h-10 w-full resize-none rounded-lg bg-muted/40 px-3 py-2 text-sm shadow-sm focus-visible:ring-0"
      />

      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <Smile className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Emoji</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="shrink-0">
                <Mic className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button type="submit" size="icon" disabled={!value.trim()} className="shrink-0">
          <SendHorizonal className="size-4" />
        </Button>
      </div>
    </form>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const { text, uid, photoURL, displayName, createdAt } = message;
  const isMe = auth.currentUser && uid === auth.currentUser.uid;

  const timestamp = createdAt && "toDate" in createdAt ? createdAt.toDate() : undefined;
  const timeLabel = timestamp
    ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(timestamp)
    : "";

  return (
    <div className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start") }>
      {!isMe && (
        <Avatar className="size-7">
          <AvatarImage src={photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"} />
          <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("group max-w-[75%]", isMe ? "items-end text-right" : "items-start text-left") }>
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
        <div className="mt-1 text-[11px] leading-none text-muted-foreground">
          {timeLabel}
        </div>
      </div>

      {isMe && (
        <Avatar className="size-7">
          <AvatarImage src={auth.currentUser?.photoURL || photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"} />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
