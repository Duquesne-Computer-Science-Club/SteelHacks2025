'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load username and lobby on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Unknown';
    setUsername(storedUsername);

    const activeLobby = localStorage.getItem('activeLobby');
    if (activeLobby) {
      const lobby = JSON.parse(activeLobby);
      setRoom(lobby.id);
      setIsConnected(true);
    }
  }, []);

  // Poll messages
  useEffect(() => {
    if (!isConnected || !room) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?room=${encodeURIComponent(room)}`, {
          cache: 'no-store', // ensures fresh data every fetch
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [isConnected, room]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: username, text: input, timestamp: Date.now(), room }),
      });
      setInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '8px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '6px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{
          padding: '8px',
          borderRadius: '4px',
          width: '100%',
          border: '1px solid #ccc',
          outline: 'none',
        }}
      />
    </div>
  );
};

export default ChatRoom;