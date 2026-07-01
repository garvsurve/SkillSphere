import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { messagesApi } from '../api';

const ChatBox = ({ currentUser, chatUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!chatUser) return;
    try {
      const res = await messagesApi.getHistory(chatUser.id);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await messagesApi.send({ receiverId: chatUser.id, content: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="sketch-card sketch-card-tape" style={{ display: 'flex', flexDirection: 'column', height: '500px', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px dashed var(--muted-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <img 
          src={`/avatars/${chatUser.avatarId || 'avatar1'}.svg`} 
          alt={chatUser.name} 
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--fg-color)' }}
        />
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{chatUser.name}</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--fg-color)', opacity: 0.6, fontStyle: 'italic', marginTop: 'auto', marginBottom: 'auto' }}>
            No messages yet. Say hi!
          </p>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === (currentUser.id || currentUser.userId);
            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{
                  background: isMe ? 'var(--fg-color)' : 'var(--muted-color)',
                  color: isMe ? 'var(--bg-color)' : 'var(--fg-color)',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  borderBottomRightRadius: isMe ? '0' : '12px',
                  borderBottomLeftRadius: isMe ? '12px' : '0',
                  border: isMe ? 'none' : '2px solid var(--fg-color)',
                  fontSize: '1.1rem',
                  lineHeight: '1.4'
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--fg-color)', opacity: 0.6, marginTop: '0.2rem', textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          className="sketch-input" 
          style={{ flex: 1 }} 
          placeholder="Type a message..." 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)} 
        />
        <button type="submit" className="sketch-button primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
