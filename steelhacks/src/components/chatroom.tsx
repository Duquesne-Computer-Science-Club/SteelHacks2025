'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
    sender: string;
    text: string;
    timestamp: number;
}

const ROOMS = ['Room 100', 'Room 101', 'Room 102'];

const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRoom(e.target.value);
    };

    const handleConnect = () => {
        if (username.trim() !== '' && room !== '') setIsConnected(true);
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
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Your name"
                    style={{ width: '80%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <button onClick={handleConnect} style={{ marginLeft: 8, padding: '8px 16px' }}>
                    Connect
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
            <h2>Chatroom</h2>
            <div style={{ marginBottom: 8 }}>
                <span>Connected as: <strong>{username}</strong></span>
                <span style={{ marginLeft: 16 }}>Room: <strong>{room}</strong></span>
            </div>
            <div style={{ height: 300, overflowY: 'auto', border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ textAlign: msg.sender === username ? 'right' : 'left', margin: '4px 0' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                background: msg.sender === username ? '#e3f2fd' : '#ffe0b2',
                                borderRadius: 12,
                                padding: '6px 12px',
                                maxWidth: '70%',
                                wordBreak: 'break-word',
                            }}
                        >
                            <strong>{msg.sender}:</strong> {msg.text}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={{ width: '80%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button onClick={sendMessage} style={{ marginLeft: 8, padding: '8px 16px' }}>
                Send
            </button>
        </div>
    );
};

export default ChatRoom;