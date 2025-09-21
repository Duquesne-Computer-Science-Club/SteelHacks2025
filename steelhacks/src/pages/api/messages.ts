import { NextApiRequest, NextApiResponse } from "next";

interface Message {
  sender: string;
  text: string;
  timestamp: number;
  room: string;
}

const messagesByRoom: Record<string, Message[]> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { room } = req.query;
    if (!room || typeof room !== "string") {
      return res.status(400).json({ error: "Room is required" });
    }
    return res.status(200).json(messagesByRoom[room] || []);
  }

  if (req.method === "POST") {
    const { sender, text, timestamp, room } = req.body;
    if (!room) {
      return res.status(400).json({ error: "Room is required" });
    }

    const message: Message = { sender, text, timestamp, room };
    if (!messagesByRoom[room]) messagesByRoom[room] = [];
    messagesByRoom[room].push(message);

    return res.status(200).json({ success: true, message });
  }

  return res.status(405).json({ error: "Method not allowed" });
}