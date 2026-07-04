import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { githubApi, authApi } from '../api';
import { SketchCard } from '../components/Sketch';
import { Github, Loader2 } from 'lucide-react';

const GitHubCallback = ({ user, setUser }) => {
  const [status, setStatus] = useState('Connecting to GitHub...');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        setIsError(true);
        setStatus('Error: No authorization code found.');
        setTimeout(() => navigate(user ? '/profile' : '/login'), 3000);
        return;
      }

      try {
        const localUserStr = localStorage.getItem('user');
        const activeUser = user || (localUserStr ? JSON.parse(localUserStr) : null);
        const activeUserId = activeUser?.userId || activeUser?.id;

        if (activeUserId) {
          // Profile Connection Flow
          await githubApi.connect(activeUserId, code);
          setStatus('Successfully connected GitHub! Syncing your skills...');
          setTimeout(() => navigate(`/dashboard`), 2000);
        } else {
          // Login / Signup Flow
          const res = await authApi.githubLogin(code);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
          
          setStatus('Successfully logged in with GitHub!');
          setTimeout(() => {
            if (res.data.techStack && res.data.techStack.length > 0) {
              navigate('/feed');
            } else {
              navigate('/onboarding');
            }
          }, 2000);
        }
      } catch (err) {
        console.error('GitHub auth failed', err);
        setIsError(true);
        setStatus('Failed to authenticate with GitHub.');
        setTimeout(() => navigate(user ? '/dashboard' : '/login'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, user, setUser]);

  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 100px)',
      textAlign: 'center'
    }}>
      <SketchCard decoration="pin" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Github size={64} style={{ color: isError ? '#ff4d4d' : 'var(--fg-color)' }} />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Kalam', cursive" }}>
          GitHub Sync
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginBottom: '1.5rem' }}>
          {status}
        </p>
        
        {status.includes('Connecting') && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Loader2 className="spinner" size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--fg-color)' }} />
          </div>
        )}
      </SketchCard>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GitHubCallback;
