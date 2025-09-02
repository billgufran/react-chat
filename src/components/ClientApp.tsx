"use client";

import { useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { VscSignOut } from "react-icons/vsc";
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
    <div className="max-w-[728px] mx-auto">
      <header className="fixed top-0 w-full max-w-[728px] bg-white h-[70px] flex items-center justify-between z-50 px-4 box-border shadow-sm">
        <div className="text-2xl font-bold text-blue-500">ReactChat</div>
        <SignOut />
      </header>
      <section className="flex flex-col justify-center min-h-screen bg-white">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = async () => {
    await firebaseSignInWithPopup();
  };
  return (
    <button
      className="text-white bg-purple-600 font-medium w-[420px] mx-auto mt-56 py-3 rounded-md hover:bg-purple-700 transition"
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </button>
  );
}

function SignOut() {
  return auth.currentUser ? (
    <button
      className="text-white bg-indigo-800 rounded-md p-2 hover:bg-indigo-900 transition"
      onClick={firebaseSignOut}
    >
      <VscSignOut />
    </button>
  ) : null;
}

function ChatRoom() {
  const recentChat = useRef<HTMLSpanElement | null>(null);
  const messagesRef = collection(db, "messages");
  const q: Query<DocumentData> = fsQuery(messagesRef, orderBy("createdAt"), limit(25));
  const [_data, _loading, _error, snapshot] = useCollectionData<DocumentData>(q);
  const messages: Message[] | undefined = snapshot?.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Message, 'id'>),
  }));
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    const { uid, photoURL, displayName } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });
    setFormValue("");
    if (recentChat.current) recentChat.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main className="p-2 h-[80vh] my-[10vh] overflow-y-scroll flex flex-col">
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={recentChat}></span>
      </main>
      <form
        onSubmit={sendMessage}
        className="h-[10vh] fixed bottom-0 w-full max-w-[728px] flex text-2xl outline outline-1 outline-black/10"
      >
        <input
          className="flex-1 text-white bg-neutral-700 outline-none border-none px-2"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button
          type="submit"
          disabled={!formValue}
          className="w-[20%] bg-purple-600 text-white disabled:opacity-50 flex items-center justify-center"
        >
          <FiSend />
        </button>
      </form>
    </>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const { text, uid, photoURL, displayName } = message;
  const isSent = auth.currentUser && uid === auth.currentUser.uid;
  return (
    <div className={"flex items-center " + (isSent ? "flex-row-reverse" : "") }>
      <img
        className="w-8 h-8 rounded-full m-1"
        src={photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"}
        alt="avatar"
      />
      <p
        className={
          "m-1 px-4 py-3 rounded-full " + (isSent ? "bg-blue-500 text-white self-end" : "bg-neutral-200 text-neutral-900")
        }
      >
        {text}
      </p>
      <div className="sr-only">{displayName}</div>
    </div>
  );
}
