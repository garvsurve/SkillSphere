import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { githubApi, authApi } from '../api';

const GitHubCallback = ({ user, setUser }) => {
  const [status, setStatus] = useState('Connecting to GitHub...');
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
        setStatus('Error: No authorization code found.');
        setTimeout(() => navigate(user ? '/profile' : '/login'), 3000);
        return;
      }

      try {
        const localUserStr = localStorage.getItem('user');
        const activeUser = user || (localUserStr ? JSON.parse(localUserStr) : null);

        if (activeUser && activeUser.id) {
          // Profile Connection Flow
          await githubApi.connect(activeUser.id, code);
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
        setStatus('Failed to authenticate with GitHub.');
        setTimeout(() => navigate(user ? '/dashboard' : '/login'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, user, setUser]);

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMjAgME0wIDBMMjAgMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>
      
      <div className="border-4 border-black p-8 rounded-2xl bg-white shadow-offset text-center relative z-10 max-w-md w-full">
        <h2 className="font-kalam text-3xl font-bold mb-6">GitHub Sync</h2>
        <p className="font-kalam text-xl mb-4">{status}</p>
        
        {status.includes('Connecting') && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mt-4"></div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
