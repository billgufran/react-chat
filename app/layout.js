export const metadata = {
  title: 'ReactChat',
  description: 'Chat app migrated to Next.js App Router',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

