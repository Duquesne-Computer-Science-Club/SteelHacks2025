import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Link
        href="/auth"
        style={{
          padding: '1rem 2rem',
          background: '#0070f3',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        Login
      </Link>
    </main>
  );
}