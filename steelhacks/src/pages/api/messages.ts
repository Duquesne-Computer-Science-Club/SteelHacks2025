import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory store for demonstration (use a database for production)
type Message = {
    sender: string;
    text: string;
    timestamp: number;
    room: string;
};

const chatLogs: Record<string, Message[]> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { room } = req.query;
        if (typeof room !== 'string' || !room) {
            return res.status(400).json({ error: 'Room is required' });
        }
        // Return messages for the requested room only
        res.status(200).json(chatLogs[room] || []);
    } else if (req.method === 'POST') {
        const { sender, text, timestamp, room } = req.body;
        if (
            typeof sender !== 'string' ||
            typeof text !== 'string' ||
            typeof timestamp !== 'number' ||
            typeof room !== 'string' ||
            !room
        ) {
            return res.status(400).json({ error: 'Invalid message format' });
        }
        // Store message in the correct room
        if (!chatLogs[room]) chatLogs[room] = [];
        chatLogs[room].push({ sender, text, timestamp, room });
        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}