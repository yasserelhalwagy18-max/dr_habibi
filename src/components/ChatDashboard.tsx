import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, User as UserIcon } from "lucide-react";

interface ChatUser {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatDashboardProps {
  currentUserId: string | null;
  currentUserRole: string;
}

export const ChatDashboard: React.FC<ChatDashboardProps> = ({ currentUserId, currentUserRole }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUserId) return;

    // Connect to Socket.io
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", currentUserId);
    });

    newSocket.on("newMessage", (message: Message) => {
      // Only append if it's relevant to the current conversation
      // The condition ensures we see our own sent messages and received messages from active chat
      if (
        (message.senderId === currentUserId && message.receiverId === activeTargetId) ||
        (message.senderId === activeTargetId && message.receiverId === currentUserId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId, activeTargetId]);

  // Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/chat/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setChatUsers(data.data);
          if (data.data.length > 0) {
            setActiveTargetId(data.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chat history when active target changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!activeTargetId) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`http://localhost:5000/api/chat/messages/${activeTargetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };
    fetchHistory();
  }, [activeTargetId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !socket || !currentUserId || !activeTargetId) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: activeTargetId,
      content: newMessageText,
    };

    socket.emit("sendMessage", messageData);
    setNewMessageText("");
  };

  const activeTarget = chatUsers.find((u) => u.id === activeTargetId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[80vh] min-h-[600px] max-w-6xl mx-auto px-4" dir="rtl">
      {/* Sidebar: Users List */}
      <div className="md:col-span-4 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-4 flex flex-col space-y-4 h-full">
        <h3 className="text-sm font-bold text-white px-2">
          {currentUserRole === "coach" ? "مخاطبین من (بیماران)" : "مخاطبین من (درمانگر)"}
        </h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chatUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveTargetId(user.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-right transition-all ${
                activeTargetId === user.id
                  ? "bg-emerald-500/10 border-emerald-500 text-white"
                  : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activeTargetId === user.id ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
              }`}>
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">{user.name}</span>
                <span className="text-[10px] opacity-70">
                  {user.role === "COACH" ? "درمانگر" : "بیمار"}
                </span>
              </div>
            </button>
          ))}
          {chatUsers.length === 0 && (
            <div className="text-center py-10 text-xs text-zinc-500">
              مخاطبی یافت نشد.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-8 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl flex flex-col overflow-hidden h-full">
        {activeTargetId && activeTarget ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{activeTarget.name}</span>
                <span className="text-[10px] text-zinc-400">آنلاین (فرضی)</span>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-zinc-950/30">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[75%] ${isMe ? "self-start" : "self-end"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className={`text-[9px] text-zinc-500 mt-1.5 ${isMe ? "text-right" : "text-left"}`}>
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="m-auto text-xs text-zinc-500">
                  شروع مکالمه با {activeTarget.name}...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="پیام خود را بنویسید..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-zinc-950 rounded-xl px-5 py-3 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">
            برای شروع مکالمه یک مخاطب انتخاب کنید.
          </div>
        )}
      </div>
    </div>
  );
};
