'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
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
        Dive into deliciousness with our exciting options!
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>      
        
      </div>
	  
	  
    </main>
  );
}