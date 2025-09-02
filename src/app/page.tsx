import { cookies } from "next/headers";
import ChatRoom from "@/components/ChatRoom";
import SignInCard from "@/components/SignInCard";

export default async function Page() {
  const cookieStore = await cookies();
  const isAuthed = Boolean(cookieStore.get("rc-auth")?.value);

  if (isAuthed) {
    return <ChatRoom />;
  }

  return (
    <div className="flex h-full items-center justify-center">
      <SignInCard />
    </div>
  );
}
