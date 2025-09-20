'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
    sender: string;
    text: string;
    timestamp: number;
}

const ROOMS = ['Room 100', 'Room 101', 'Room 102'];

function getSessionIdFromCookie(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)sessionId=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

function getUsernameFromSession(): string {
    // For demo: get username from localStorage using sessionId
    const sessionId = getSessionIdFromCookie();
    if (!sessionId) return "Unknown";
    // If you store username by sessionId, adjust this logic
    const username = localStorage.getItem("username");
    return username || "Unknown";
}

const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get username from session on mount
    useEffect(() => {
        setUsername(getUsernameFromSession());
    }, []);

    // Poll messages from server every 2 seconds
    useEffect(() => {
        if (!isConnected || !room) return;
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/messages?room=${encodeURIComponent(room)}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch {}
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [isConnected, room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === '') return;
        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: username,
                    text: input,
                    timestamp: Date.now(),
                    room,
                }),
            });
            setInput('');
        } catch {}
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') sendMessage();
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRoom(e.target.value);
    };

    const handleConnect = () => {
        if (room !== '') setIsConnected(true);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (trimmed && !messages.find(msg => msg.text === trimmed && msg.sender === username)) {
            setMessages([...messages, { sender: username, text: trimmed, timestamp: Date.now() }]);
        }
        setInput('');
    };

    if (!isConnected) {
        return (
            <div style={{ maxWidth: 400, margin: '0 auto', border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
                <h2>Join a chatroom</h2>
                <div style={{ marginBottom: 8 }}>
                    <select value={room} onChange={handleRoomChange} style={{ width: '80%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
                        <option value="">Select a room...</option>
                        {ROOMS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleConnect} style={{ marginLeft: 8, padding: '8px 16px' }}>
                    Connect
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                color: '#f5f5f5',
            }}
        >
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            alignSelf: 'flex-start',
                            background: 'rgba(60, 60, 80, 0.85)',
                            color: '#fff',
                            padding: '10px 16px',
                            borderRadius: '18px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            maxWidth: '80%',
                            fontSize: '1rem',
                            border: '1px solid #6c63ff',
                        }}
                    >
                        {msg.sender}: {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form
                onSubmit={handleSend}
                style={{
                    display: 'flex',
                    gap: '8px',
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #6c63ff',
                        backgroundColor: '#232526',
                        color: '#f5f5f5',
                        fontSize: '1rem',
                        outline: 'none',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;