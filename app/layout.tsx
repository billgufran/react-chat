import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReactChat',
  description: 'Chat app migrated to Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
