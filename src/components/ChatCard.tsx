import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

interface Message {
    _id: string;
    sender_id: string;
    sender_role: 'user' | 'technician';
    content: string;
    timestamp: string;
}

interface ChatCardProps {
    requestId: string;
    currentUserId: string;
    currentUserRole: 'user' | 'technician';
    onClose?: () => void;
}

const ChatCard: React.FC<ChatCardProps> = ({ requestId, currentUserId, currentUserRole, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('electrocare_token');
        if (!token) return;

        // Base URL for socket (remove /api if present)
        const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
        console.log(`[CHAT] Connecting to socket at: ${socketUrl} for request: ${requestId}`);

        const socket = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        // Join room immediately if already connected or on connect
        if (socket.connected) {
            socket.emit('join_chat', requestId);
        }

        socket.on('connect', () => {
            console.log('[SOCKET] Connected, joining room:', requestId);
            socket.emit('join_chat', requestId);
        });

        // Fetch history
        fetch(`${import.meta.env.VITE_API_URL}/chat/${requestId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(`[CHAT] Loaded ${data.length} messages`);
                setMessages(data);
            })
            .catch((err) => console.error('History load error:', err));

        socket.on('new_message', (msg: Message) => {
            console.log('[SOCKET] New message received:', msg);
            setMessages((prev) => {
                if (prev.find(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        });

        socket.on('connect_error', (err: any) => {
            console.error('[SOCKET] Connection error:', err.message);
        });

        return () => {
            console.log('[CHAT] Disconnecting socket');
            socket.disconnect();
        };
    }, [requestId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        console.log('[CHAT] Sending message:', newMessage);
        socketRef.current.emit('send_message', {
            requestId,
            content: newMessage,
        });
        setNewMessage('');
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden z-50 flex flex-col max-h-[500px]"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold">Service Chat</h3>
                        <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Request #{requestId.slice(-6)}</p>
                    </div>
                </div>
                <button
                    onClick={() => { setIsOpen(false); onClose?.(); }}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[300px]"
            >
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender_id === currentUserId
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                }`}
                        >
                            <p>{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${msg.sender_id === currentUserId ? 'text-white/70' : 'text-slate-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-slate-100 flex gap-2"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
                <button
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </motion.div>
    );
};

export default ChatCard;
