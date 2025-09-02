"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
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
} from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ChatroomHeader from "./ChatroomHeader";
import MessageComposer from "./MessageComposer";
import { Message } from "@/types/common";
import ChatMessage from "./ChatMessage";

export default function ChatRoom() {
  const recentChat = useRef<HTMLDivElement | null>(null);
  const messagesRef = collection(db, "messages");
  const q: Query<DocumentData> = fsQuery(messagesRef, orderBy("createdAt"), limit(100));
  const [_data, loading, _error, snapshot] = useCollectionData<DocumentData>(q);
  const messages: Message[] = useMemo(
    () => snapshot?.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })) ?? [],
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
        {
            process.env.NEXT_PUBLIC_FLAG_SHOW_CHATROOM_HEADER === "true" && (
                <ChatroomHeader />
            )
        }

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

      <MessageComposer value={formValue} onChange={setFormValue} onSend={sendMessage} />
    </div>
  );
}
