import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export interface LiveMessage {
    senderId: string;
    senderName?: string;
    content: string;
    timestamp: string;
    isMe?: boolean;
}

export const useLiveChat = (socket: Socket | null, roomId: string, userId: string, userName: string) => {
    const [messages, setMessages] = useState<LiveMessage[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('live_message', (data: any) => {
            // data = { content, senderId, senderName, timestamp, roomId }
            const newMessage: LiveMessage = {
                senderId: data.senderId,
                senderName: data.senderName,
                content: data.content,
                timestamp: data.timestamp || new Date().toISOString(),
                isMe: data.senderId === userId
            };
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off('live_message');
        };
    }, [socket, roomId, userId]);

    const sendMessage = (content: string) => {
        if (!socket) return;

        const messagePayload = {
            roomId,
            content,
            senderId: userId,
            senderName: userName,
            timestamp: new Date().toISOString()
        };

        // Optimistic update
        const newMessage: LiveMessage = { ...messagePayload, isMe: true };
        setMessages((prev) => [...prev, newMessage]);

        socket.emit('live_message', messagePayload);
    };

    return {
        messages,
        sendMessage
    };
};
