import type { Metadata } from 'next';
import './globals.css';
import UserMenu from '@/components/UserMenu';
import { MessageSquareText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ReactChat',
  description: 'Chat app migrated to Next.js App Router',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 overflow-hidden antialiased text-neutral-900">
        <div className="mx-auto h-svh w-full max-w-screen-sm md:max-w-3xl">
          <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-5 text-primary" />
              <span className="text-base font-semibold tracking-tight">ReactChat</span>
            </div>
            <UserMenu />
          </header>
          <main className="flex h-[calc(100svh-64px)] flex-col bg-background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
