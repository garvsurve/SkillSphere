import React, { useState, useEffect } from 'react';
import { Settings, Clock, CheckCircle, XCircle } from 'lucide-react';
import ProfileEditModal from '../components/ProfileEditModal';
import TechStackBadge from '../components/TechStackBadge';
import ChatBox from '../components/ChatBox';
import SkillRadarChart from '../components/SkillRadarChart';
import { usersApi, sessionRequestsApi, messagesApi } from '../api';

const DashboardPage = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'incoming', 'sent', 'messages'
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeAction, setActiveAction] = useState(null); // { id, type: 'accept' | 'reject' }
  const [actionNote, setActionNote] = useState('');
  
  // Messaging state
  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);

  useEffect(() => {
    if (activeTab === 'incoming') fetchIncoming();
    if (activeTab === 'sent') fetchSent();
    if (activeTab === 'messages') fetchConversations();
  }, [activeTab]);

  const fetchIncoming = async () => {
    try {
      const res = await sessionRequestsApi.getIncoming();
      setIncomingRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSent = async () => {
    try {
      const res = await sessionRequestsApi.getSent();
      setSentRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchConversations = async () => {
    try {
      const res = await messagesApi.getConversations();
      setConversations(res.data);
    } catch (err) { console.error(err); }
  };

  const handleStartChat = (otherUser) => {
    setActiveChatUser(otherUser);
    setActiveTab('messages');
  };

  const handleProfileSave = async (updatedData) => {
    try {
      const res = await usersApi.updateProfile(user.userId || user.id, updatedData);
      const newUserData = { ...user, ...res.data, userId: res.data.id };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const AVAILABLE_INTENTS = [
    'Open to Work', 'Open to Collaborate', 'Learning', 'Need Help', 
    'Can Help', 'Looking for Projects', 'Building Startup', 
    'Side Projects', 'Open Source', 'Interview Prep'
  ];

  const handleIntentToggle = async (intent) => {
    const currentIntents = user?.intents || [];
    const newIntents = currentIntents.includes(intent) 
      ? currentIntents.filter(i => i !== intent) 
      : [...currentIntents, intent];
    
    try {
      const updatedData = {
        name: user.name,
        bio: user.bio,
        avatarId: user.avatarId,
        experience: user.experience,
        company: user.company,
        techStack: user.techStack,
        intents: newIntents
      };
      const res = await usersApi.updateProfile(user.userId || user.id, updatedData);
      const newUserData = { ...user, ...res.data, userId: res.data.id };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (err) {
      console.error(err);
      alert('Failed to update intents.');
    }
  };

  const confirmAction = async () => {
    if (!activeAction) return;
    try {
      if (activeAction.type === 'accept') {
        await sessionRequestsApi.accept(activeAction.id, { responseNote: actionNote || 'Looking forward to it!' });
      } else {
        await sessionRequestsApi.reject(activeAction.id, { responseNote: actionNote || 'Not available right now.' });
      }
      setActiveAction(null);
      setActionNote('');
      fetchIncoming();
    } catch (err) {
      alert('Failed to ' + activeAction.type + ' request');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'PENDING') return <span style={{ color: '#f39c12', fontWeight: 'bold' }}><Clock size={16} /> Pending</span>;
    if (status === 'ACCEPTED') return <span style={{ color: '#27ae60', fontWeight: 'bold' }}><CheckCircle size={16} /> Accepted</span>;
    if (status === 'REJECTED') return <span style={{ color: '#c0392b', fontWeight: 'bold' }}><XCircle size={16} /> Rejected</span>;
    return null;
  };

  return (
    <div className="container" style={{ maxWidth: '900px', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '3rem', transform: 'rotate(-1deg)', marginBottom: '2rem' }}>My Dashboard</h1>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px dashed var(--muted-color)', paddingBottom: '1rem' }}>
        <button 
          className="sketch-button" 
          style={{ background: activeTab === 'profile' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'profile' ? 'var(--bg-color)' : 'inherit' }}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className="sketch-button" 
          style={{ background: activeTab === 'incoming' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'incoming' ? 'var(--bg-color)' : 'inherit' }}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Requests
        </button>
        <button 
          className="sketch-button" 
          style={{ background: activeTab === 'sent' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'sent' ? 'var(--bg-color)' : 'inherit' }}
          onClick={() => setActiveTab('sent')}
        >
          Sent Requests
        </button>
        <button 
          className="sketch-button" 
          style={{ background: activeTab === 'messages' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'messages' ? 'var(--bg-color)' : 'inherit' }}
          onClick={() => { setActiveTab('messages'); setActiveChatUser(null); }}
        >
          Messages
        </button>
      </div>

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="sketch-card sketch-card-tape">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <img 
                src={`/avatars/${user?.avatarId || 'avatar1'}.svg`} 
                alt="Avatar" 
                style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--fg-color)' }}
              />
              <div>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{user?.name}</h2>
                <p style={{ fontSize: '1.2rem', color: '#666', margin: '0.5rem 0' }}>{user?.experience} • {user?.company}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  {user?.techStack?.map(tech => <TechStackBadge key={tech} text={tech} />)}
                </div>
              </div>
            </div>
            <button className="sketch-button secondary" onClick={() => setIsEditing(true)}>
              <Settings size={18} /> Edit Profile
            </button>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>About Me</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', background: 'var(--muted-color)', padding: '1rem', border: '1px dashed var(--fg-color)' }}>
              {user?.bio || 'No bio provided yet.'}
            </p>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Looking For (Intents)</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>Click to toggle what you're looking for on SkillSphere. This helps others find you!</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {AVAILABLE_INTENTS.map(intent => {
                const isActive = user?.intents?.includes(intent);
                return (
                  <button 
                    key={intent}
                    onClick={() => handleIntentToggle(intent)}
                    style={{ 
                      background: isActive ? 'var(--accent-color)' : 'var(--card-bg)', 
                      color: isActive ? 'var(--bg-color)' : 'var(--fg-color)',
                      border: `2px solid ${isActive ? 'var(--accent-color)' : 'var(--muted-color)'}`,
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontFamily: "'Patrick Hand', cursive",
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.1s'
                    }}
                  >
                    {intent}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GitHub Verified Skills */}
          <div style={{ marginTop: '3rem' }}>
            <SkillRadarChart userId={user?.userId || user?.id} isOwner={true} />
          </div>
        </div>
      )}

      {/* INCOMING REQUESTS TAB */}
      {activeTab === 'incoming' && (
        <div>
          {incomingRequests.length === 0 ? <p>No incoming session requests.</p> : incomingRequests.map(req => (
            <div key={req.id} className="sketch-card sketch-card-tack" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={`/avatars/${req.fromUserAvatarId || 'avatar1'}.svg`} style={{ width: '50px', borderRadius: '50%' }} />
                  <div>
                    <h3 style={{ margin: 0 }}>{req.fromUserName}</h3>
                    <div style={{ fontSize: '0.8rem' }}>Requested {new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>
              
              <div style={{ background: 'var(--muted-color)', padding: '1rem', borderLeft: '4px solid var(--fg-color)', marginBottom: '1rem' }}>
                <strong>Message:</strong> <p style={{ margin: '0.5rem 0' }}>{req.message}</p>
              </div>

              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button className="sketch-button" style={{ background: '#a8e6cf', color: '#2d2d2d' }} onClick={() => setActiveAction({ id: req.id, type: 'accept' })}>Accept</button>
                  <button className="sketch-button" style={{ background: '#ff8b94', color: '#2d2d2d' }} onClick={() => setActiveAction({ id: req.id, type: 'reject' })}>Reject</button>
                </div>
              )}
              {req.status === 'ACCEPTED' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button className="sketch-button primary" onClick={() => handleStartChat({ id: req.fromUserId, name: req.fromUserName, avatarId: req.fromUserAvatarId })}>
                    Chat with {req.fromUserName}
                  </button>
                </div>
              )}
              {req.status !== 'PENDING' && req.responseNote && (
                <div style={{ background: 'var(--muted-color)', padding: '1rem', borderLeft: `4px solid ${req.status === 'ACCEPTED' ? '#27ae60' : '#c0392b'}` }}>
                  <strong>Your Reply:</strong> <p style={{ margin: '0.5rem 0' }}>{req.responseNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SENT REQUESTS TAB */}
      {activeTab === 'sent' && (
        <div>
          {sentRequests.length === 0 ? <p>You haven't sent any requests.</p> : sentRequests.map(req => (
            <div key={req.id} className="sketch-card sketch-card-tape" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>To: {req.toUserName}</h3>
                  <div style={{ fontSize: '0.8rem' }}>Sent {new Date(req.createdAt).toLocaleDateString()}</div>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>
              
              <div style={{ background: 'var(--muted-color)', padding: '1rem', borderLeft: '4px solid var(--fg-color)', marginBottom: '1rem' }}>
                <strong>Your Message:</strong> <p style={{ margin: '0.5rem 0' }}>{req.message}</p>
              </div>
              
              {req.status !== 'PENDING' && req.responseNote && (
                <div style={{ background: 'var(--muted-color)', padding: '1rem', borderLeft: `4px solid ${req.status === 'ACCEPTED' ? '#27ae60' : '#c0392b'}` }}>
                  <strong>Response Note:</strong> <p style={{ margin: '0.5rem 0' }}>{req.responseNote}</p>
                </div>
              )}
              {req.status === 'ACCEPTED' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button className="sketch-button primary" onClick={() => handleStartChat({ id: req.toUserId, name: req.toUserName, avatarId: req.toUserAvatarId })}>
                    Chat with {req.toUserName}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ marginTop: 0 }}>Conversations</h2>
            {conversations.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No active chats.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {conversations.map(conv => (
                  <div 
                    key={conv.id} 
                    className={`sketch-card ${activeChatUser?.id === conv.id ? 'sketch-card-tack' : ''}`}
                    style={{ 
                      padding: '1rem', 
                      cursor: 'pointer', 
                      background: activeChatUser?.id === conv.id ? 'var(--bg-color)' : 'var(--muted-color)',
                      border: activeChatUser?.id === conv.id ? '2px solid var(--fg-color)' : '2px dashed var(--fg-color)'
                    }}
                    onClick={() => setActiveChatUser(conv)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={`/avatars/${conv.avatarId || 'avatar1'}.svg`} style={{ width: '40px', borderRadius: '50%' }} />
                      <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{conv.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 2 }}>
            {activeChatUser ? (
              <ChatBox currentUser={user} chatUser={activeChatUser} />
            ) : (
              <div className="sketch-card sketch-card-tape" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px', color: '#666', fontSize: '1.2rem' }}>
                Select a conversation to start chatting.
              </div>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <ProfileEditModal user={user} onClose={() => setIsEditing(false)} onSave={handleProfileSave} />
      )}

      {activeAction && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="sketch-card sketch-card-tape" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ marginTop: 0 }}>
              {activeAction.type === 'accept' ? 'Accept Request' : 'Reject Request'}
            </h2>
            <p>
              {activeAction.type === 'accept' 
                ? 'Send a message with a meeting link (e.g. Google Meet or Zoom) and a time.' 
                : 'Send a polite rejection message.'}
            </p>
            <textarea 
              className="sketch-input" 
              rows={4} 
              value={actionNote} 
              onChange={e => setActionNote(e.target.value)}
              placeholder={activeAction.type === 'accept' ? "Here is the Google Meet link..." : "Sorry, I'm busy..."}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button className="sketch-button" onClick={() => { setActiveAction(null); setActionNote(''); }}>Cancel</button>
              <button className="sketch-button primary" onClick={confirmAction}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
