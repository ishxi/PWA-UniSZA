import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../context/AppContext';
import { User } from '../../types';
import { getUIAvatar } from '../utils/uiHelpers';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface ChatRoomProps {
  otherUser: User;
  currentUser: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ otherUser, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useUI();

  // Simulate real-time messages
  useEffect(() => {
    // Load existing messages
    const loadMessages = async () => {
      // Mock data - in production, this would fetch from server
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: otherUser.id,
          receiverId: currentUser.id,
          content: `Hi ${currentUser.firstName}, I'm interested in your profile!`,
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: true,
        },
        {
          id: '2',
          senderId: currentUser.id,
          receiverId: otherUser.id,
          content: 'Thank you for reaching out! What opportunity are you offering?',
          timestamp: Date.now() - 3000000, // 50 minutes ago
          read: true,
        },
      ];
      setMessages(mockMessages);
    };

    loadMessages();

    // Simulate online status changes
    const onlineInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.3); // 70% chance of being online
    }, 30000); // Check every 30 seconds

    return () => clearInterval(onlineInterval);
  }, [otherUser.id, currentUser.id, currentUser.firstName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: newMessage.trim(),
      timestamp: Date.now(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(false);

    // Simulate sending to server
    try {
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate reply
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            senderId: otherUser.id,
            receiverId: currentUser.id,
            content: 'Thanks for your message! I\'ll get back to you soon.',
            timestamp: Date.now(),
            read: false,
          };
          setMessages(prev => [...prev, reply]);
          
          addNotification({
            message: `New message from ${otherUser.firstName}`,
            type: 'info',
          });
        }, 2000);
      }
    } catch (error) {
      addNotification({
        message: 'Failed to send message',
        type: 'error',
      });
    }
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
    }
    if (text.length === 0) {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={otherUser.avatar || getUIAvatar(`${otherUser.firstName} ${otherUser.lastName}`, 40)}
            alt={otherUser.firstName}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getUIAvatar(`${otherUser.firstName} ${otherUser.lastName}`, 40);
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {otherUser.firstName} {otherUser.lastName}
            </h3>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === currentUser.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === currentUser.id 
                  ? 'text-primary-200' 
                  : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;