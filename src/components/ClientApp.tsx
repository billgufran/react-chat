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
    <div className="App">
      <header>
        <div className="logo">ReactChat</div>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = async () => {
    await firebaseSignInWithPopup();
  };
  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
}

function SignOut() {
  return auth.currentUser ? (
    <button className="sign-out" onClick={firebaseSignOut}>
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
      <main>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={recentChat}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" disabled={!formValue}>
          <FiSend />
        </button>
      </form>
    </>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const { text, uid, photoURL, displayName } = message;
  const messageClass = auth.currentUser && uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={photoURL || "https://api.dicebear.com/7.x/identicon/svg?seed=react-chat"}
          alt="avatar"
        />
        <p id="chat-bubble">{text}</p>
      </div>
      <div>{displayName}</div>
    </>
  );
}

