import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alice in Wonderland RAG',
  description: 'Ask questions about Alice\'s Adventures in Wonderland using AI-powered semantic search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


