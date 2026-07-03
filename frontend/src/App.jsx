import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  Navigate,
  useLocation
} from 'react-router-dom';
import { Search, LogOut, ArrowRight, Fingerprint, Home, LayoutDashboard, Sun, Moon, Bell } from 'lucide-react';
import api, { authApi, usersApi, sessionRequestsApi, notificationsApi } from './api';
import OnboardingPage from './pages/OnboardingPage';
import FeedPage from './pages/FeedPage';
import DashboardPage from './pages/DashboardPage';
import AvatarPicker from './components/AvatarPicker';
import TagInput from './components/TagInput';

import { SketchButton, SketchCard } from './components/Sketch';
import DiscoverPage from './pages/DiscoverPage';
import GitHubCallback from './pages/GitHubCallback';

// --- LAYOUT COMPONENTS ---

const Navbar = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Initial fetch of unread notifications
    notificationsApi.getUnread().then(res => setNotifications(res.data)).catch(console.error);

    // Setup SSE connection
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';
    const sse = new EventSource(`${baseUrl}/notifications/stream?token=${token}`);
    
    sse.addEventListener('notification', (e) => {
      const newNotif = JSON.parse(e.data);
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => sse.close();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const getLinkStyle = (path) => ({
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    borderBottom: location.pathname === path ? '3px solid #ff4d4d' : 'none',
    paddingBottom: '0.2rem'
  });

  return (
    <nav className="nav">
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        SkillSphere<span className="correction-mark">!</span>
      </Link>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-color)' }}>
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <Link to="/discover" className="font-heading" style={{ ...getLinkStyle('/discover') }}><Search size={18}/> Discover</Link>
        {user ? (
          <>
            <Link to="/feed" className="font-heading" style={{ ...getLinkStyle('/feed') }}><Home size={18}/> Feed</Link>
            
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-color)', position: 'relative', marginTop: '5px' }}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-8px',
                    background: '#ff4d4d', color: 'white', borderRadius: '50%',
                    width: '18px', height: '18px', fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '100%', right: '0', marginTop: '10px',
                  background: 'var(--card-bg)', border: '2px solid var(--border-color)',
                  borderRadius: '12px', width: '300px', padding: '1rem',
                  boxShadow: '4px 4px 0 var(--border-color)', zIndex: 1000
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontFamily: "'Patrick Hand', cursive", fontSize: '1.2rem' }}>Notifications</h4>
                  {notifications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>All caught up!</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.map(n => (
                        <div key={n.id} style={{ 
                          padding: '0.8rem', background: 'var(--bg-color)', 
                          borderRadius: '8px', fontSize: '0.9rem',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                          border: '1px solid var(--border-color)'
                        }}>
                          <span style={{ flex: 1 }}>{n.message}</span>
                          <button 
                            onClick={() => markAsRead(n.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', fontSize: '1.2rem', padding: '0 0 0 0.5rem' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link to="/dashboard" className="font-heading" style={{ ...getLinkStyle('/dashboard') }}><LayoutDashboard size={18}/> Dashboard</Link>
            <SketchButton onClick={onLogout} style={{ padding: '0.4rem 1rem', fontSize: '1.1rem' }}>
            <LogOut size={16} /> bye
          </SketchButton>
        </>
      ) : (
        <Link to="/login" className="sketch-button" style={{ textDecoration: 'none', borderBottom: '4px solid #ff4d4d' }}>
          get in <ArrowRight size={18} />
        </Link>
        )}
      </div>
    </nav>
  );
};
// --- PAGES ---
const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  // Extra signup fields
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [company, setCompany] = useState('');
  const [avatarId, setAvatarId] = useState('avatar1');
  const [techStack, setTechStack] = useState([]);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await authApi.login({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        if (res.data.techStack && res.data.techStack.length > 0) {
          navigate('/feed');
        } else {
          navigate('/onboarding');
        }
      } else {
        await authApi.signup({ name, email, password, bio, experience, company, avatarId, techStack });
        alert('Cool! Now login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert('Oops: ' + (err.response?.data?.message || 'Bad luck!'));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '4rem', paddingBottom: '4rem' }}>
      <SketchCard decoration="tack" style={{ transform: 'rotate(1deg)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          {isLogin ? 'Hello again' : 'First time?'} <span className="correction-mark">?</span>
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <>
              <AvatarPicker selectedAvatarId={avatarId} onSelect={setAvatarId} />
              
              <div>
                <label style={{ fontWeight: 'bold' }}>Name *</label>
                <input className="sketch-input" placeholder="What's your name?" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </>
          )}

          <div>
            <label style={{ fontWeight: 'bold' }}>Email *</label>
            <input className="sketch-input" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Password *</label>
            <input className="sketch-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {!isLogin && (
            <>
              <div>
                <label style={{ fontWeight: 'bold' }}>Bio</label>
                <textarea className="sketch-input" placeholder="Tell us a bit about yourself..." value={bio} onChange={e => setBio(e.target.value)} rows={3} />
              </div>

              <div>
                <label style={{ fontWeight: 'bold' }}>Experience</label>
                <select className="sketch-input" value={experience} onChange={e => setExperience(e.target.value)}>
                  <option value="Fresher">Fresher</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3+ years">3+ years</option>
                  <option value="5+ years">5+ years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold' }}>Company / Institute</label>
                <input className="sketch-input" placeholder="Where do you work or study?" value={company} onChange={e => setCompany(e.target.value)} />
              </div>

              <div>
                <label style={{ fontWeight: 'bold' }}>Tech Stack / Domains</label>
                <TagInput tags={techStack} setTags={setTechStack} placeholder="e.g. REACT, NODEJS" />
              </div>
            </>
          )}

          <SketchButton type="submit" style={{ width: '100%', background: 'var(--fg-color)', color: 'var(--bg-color)', justifyContent: 'center' }}>
            {isLogin ? 'Let\'s go' : 'Create account'} <Fingerprint size={20} />
          </SketchButton>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', position: 'relative' }}>
          <hr style={{ borderTop: '2px dashed var(--muted-color)', borderBottom: 'none' }} />
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', padding: '0 1rem', fontFamily: "'Kalam', cursive" }}>or</span>
        </div>

        <a 
          href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id_here'}&scope=user:email`}
          className="sketch-button"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', textDecoration: 'none', background: '#24292e', color: 'white', border: '2px solid black' }}
        >
          Continue with GitHub
        </a>

        <p 
          style={{ marginTop: '2rem', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Actually, I'm new here" : "I've been here before"}
        </p>
      </SketchCard>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/login" element={user ? <Navigate to="/feed" /> : <LoginPage setUser={setUser} />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/onboarding" element={user ? <OnboardingPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/feed" element={user ? <FeedPage user={user} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/oauth/github/callback" element={<GitHubCallback user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
