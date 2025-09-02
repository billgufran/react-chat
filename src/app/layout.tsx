import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReactChat',
  description: 'Chat app migrated to Next.js App Router',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 overflow-hidden antialiased text-neutral-900">
        {children}
      </body>
    </html>
  );
}
