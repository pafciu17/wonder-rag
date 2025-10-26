import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LangGraph RAG Demo',
  description: 'Chat with your documents using RAG and LangGraph',
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


