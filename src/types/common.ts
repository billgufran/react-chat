import { type Timestamp } from "firebase/firestore";

export type Message = {
  id: string;
  text: string;
  uid: string;
  photoURL?: string | null;
  displayName?: string | null;
  createdAt?: Timestamp | null;
};
