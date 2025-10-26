import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '90vh'
      }}>
        <header style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            🐰 Alice in Wonderland RAG
          </h1>
          <p style={{ marginTop: '8px', opacity: 0.9, fontSize: '14px' }}>
            Ask questions about Alice's Adventures in Wonderland powered by AI
          </p>
        </header>
        <Chat />
      </div>
    </main>
  );
}


