'use client';

import Link from 'next/link';

export default function HomePage() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (e.target as HTMLAnchorElement).style.transform = 'scale(1.05)';
  };
  interface MouseEventHandler {
    (e: React.MouseEvent<HTMLAnchorElement>): void;
  }

  const handleMouseLeave: MouseEventHandler = (e) => {
    (e.target as HTMLAnchorElement).style.transform = 'scale(1)';
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#4B2E2E', // deep chocolate background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        fontFamily: "'Pacifico', cursive", // optional fun font
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to the Chocolate World!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        Dive into deliciousness with our exciting options below!
      </p>
      {/* Buttons */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Link to /game */}
        <Link href="/game" legacyBehavior>
          <a
            style={{
              padding: '15px 30px',
              backgroundColor: '#FF6F61', // coral pink
              color: '#fff',
              borderRadius: '12px',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Play Against Computer
          </a>
        </Link>
        {/* Link to /auth */}
        <Link href="/auth/login" legacyBehavior>
          <a
            style={{
              padding: '15px 30px',
              backgroundColor: '#6A4E42', // rich brown
              color: '#fff',
              borderRadius: '12px',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Login for PvP
          </a>
        </Link>
      </div>
    </main>
  );
}