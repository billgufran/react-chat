import ChatRoom from "@/components/ChatRoom";
import SignInCard from "@/components/SignInCard";
import { verifyAuthSession } from "@/lib/server-auth";

export default async function Page() {
  const decoded = await verifyAuthSession();
  if (decoded) {
    return <ChatRoom />;
  }
  return (
    <div className="flex h-full items-center justify-center">
      <SignInCard />
    </div>
  );
}
