import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Handshake, Heart, Bookmark, Share2, Link as LinkIcon, Users, Hash } from 'lucide-react';
import { postsApi, sessionRequestsApi, usersApi } from '../api';
import { SketchCard, SketchButton } from '../components/Sketch';
import TechStackBadge from '../components/TechStackBadge';
import SessionRequestModal from '../components/SessionRequestModal';

const POST_TYPES = [
  { label: 'Ask for Help', icon: '❓', tag: '#AskForHelp', color: '#ffaaa5' },
  { label: 'Share Knowledge', icon: '💡', tag: '#ShareKnowledge', color: '#ffd3b6' },
  { label: 'Share Project', icon: '🚀', tag: '#ShareProject', color: '#a8e6cf' },
  { label: 'General Update', icon: '📢', tag: '#Update', color: '#dcedc1' },
  { label: 'Looking for Collaborators', icon: '🎯', tag: '#Collaborators', color: '#c5a3ff' },
  { label: 'Open Source', icon: '🛠️', tag: '#OpenSource', color: '#70a1ff' },
  { label: 'Learning Journey', icon: '📚', tag: '#Learning', color: '#ff7f50' }
];

const INTENT_COLORS = {
  'Open to Work': '#a8e6cf',
  'Open to Collaborate': '#ffd3b6',
  'Learning': '#ffaaa5',
  'Need Help': '#ff8b94',
  'Can Help': '#dcedc1',
  'Looking for Projects': '#c5a3ff',
  'Building Startup': '#f6e58d',
  'Side Projects': '#7bed9f',
  'Open Source': '#70a1ff',
  'Interview Prep': '#ff7f50'
};

const FeedPage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeModalPostId, setActiveModalPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [whoToFollow, setWhoToFollow] = useState([]);
  const [activeTab, setActiveTab] = useState('All Posts');
  const [myFollowingIds, setMyFollowingIds] = useState([]);
  const [allUsersData, setAllUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFeed(), fetchUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await postsApi.getFeed();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll();
      const me = res.data.find(u => u.id === user?.userId);
      if (me) {
        setMyFollowingIds(me.followingIds || []);
      }
      const allUsers = res.data.filter(u => u.id !== user?.userId);
      setAllUsersData(allUsers);
      setSuggestedUsers(allUsers.slice(0, 3));
      setWhoToFollow(allUsers.slice(3, 6));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (id) => {
    try {
      await usersApi.toggleFollow(id);
      fetchUsers(); // Refresh following data
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      await postsApi.create({ content: newPostContent });
      setNewPostContent('');
      fetchFeed();
    } catch (err) {
      alert('Failed to post: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePostTypeSelect = (tag) => {
    setNewPostContent(prev => {
      const trimmed = prev.trim();
      if (trimmed.includes(tag)) return prev;
      return trimmed ? `${trimmed}\n\n${tag}` : tag;
    });
  };

  const handleReact = async (postId, type) => {
    try {
      await postsApi.react(postId, type);
      fetchFeed();
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  const handleCommentSubmit = async (postId, parentCommentId = null) => {
    const content = parentCommentId ? replyInputs[parentCommentId] : commentInputs[postId];
    if (!content?.trim()) return;

    try {
      await postsApi.addComment(postId, { content, parentCommentId });
      if (parentCommentId) {
        setReplyInputs({ ...replyInputs, [parentCommentId]: '' });
        setActiveReplyId(null);
      } else {
        setCommentInputs({ ...commentInputs, [postId]: '' });
      }
      fetchComments(postId);
      fetchFeed();
    } catch (err) {
      alert('Failed to add comment. Remember to login again if your session expired!');
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await postsApi.getComments(postId);
      setCommentsData(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const toggleComments = (postId) => {
    const isExpanded = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanded }));
    if (isExpanded && !commentsData[postId]) {
      fetchComments(postId);
    }
  };

  const handleSessionRequest = async (message) => {
    try {
      await sessionRequestsApi.create({ postId: activeModalPostId, message });
      alert('Session request sent successfully!');
      setActiveModalPostId(null);
    } catch (err) {
      alert('Failed to send request: ' + (err.response?.data?.message || err.message));
    }
  };

  const extractTags = (text) => {
    const tags = [];
    const cleanText = text.replace(/#\w+/g, (match) => {
      tags.push(match);
      return '';
    });
    return { text: cleanText.trim(), tags };
  };

  const renderCommentNode = (comment, postId, depth = 0) => (
    <div key={comment.id} style={{
      marginBottom: '1rem',
      paddingLeft: depth > 0 ? `${Math.min(depth * 1.5, 3)}rem` : '0',
      borderLeft: depth > 0 ? '2px solid var(--muted-color)' : 'none',
      position: 'relative'
    }}>
      {depth > 0 && <div style={{ position: 'absolute', left: 0, top: '20px', width: '15px', height: '2px', background: 'var(--muted-color)' }} />}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
        <img src={`/avatars/${comment.authorAvatarId || 'avatar1'}.svg`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--fg-color)' }} />
        <div style={{ flex: 1, background: 'var(--bg-color)', padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid var(--muted-color)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--fg-color)' }}>{comment.authorName}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--fg-color)', lineHeight: '1.5' }}>{comment.content}</p>

          <div style={{ marginTop: '0.5rem' }}>
            <button
              style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Patrick Hand', cursive" }}
              onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {activeReplyId === comment.id && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', marginLeft: '3rem' }}>
          <input
            className="sketch-input"
            placeholder="Share your thoughts..."
            style={{ flex: 1, padding: '0.5rem', fontSize: '1rem', borderRadius: '20px' }}
            value={replyInputs[comment.id] || ''}
            onChange={e => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
          />
          <SketchButton secondary style={{ padding: '0.4rem 1rem', borderRadius: '20px' }} onClick={() => handleCommentSubmit(postId, comment.id)}>
            Send
          </SketchButton>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {comment.replies.map(reply => renderCommentNode(reply, postId, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '1440px', padding: '2rem 4rem', display: 'grid', gridTemplateColumns: '250px minmax(500px, 1fr) 300px', gap: '3rem', alignItems: 'start' }}>

      {/* --------------------------------------------------- */}
      {/* LEFT SIDEBAR */}
      {/* --------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>

        {/* Greeting Card */}
        <SketchCard decoration="tape" style={{ transform: 'rotate(-1deg)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>👋 Hey {user?.name?.split(' ')[0] || 'Friend'}!</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, fontFamily: "'Kalam', cursive" }}>What are you working on today?</p>
        </SketchCard>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {['All Posts', 'Following', 'My Posts'].map(nav => (
            <button
              key={nav}
              onClick={() => setActiveTab(nav)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.2rem',
                padding: '0.5rem',
                color: activeTab === nav ? 'var(--accent-color)' : 'var(--fg-color)',
                fontWeight: activeTab === nav ? 'bold' : 'normal',
                cursor: 'pointer',
                fontFamily: "'Patrick Hand', cursive"
              }}
            >
              {nav}
            </button>
          ))}
        </div>

        {/* Topics */}
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '2px dashed var(--muted-color)', paddingBottom: '0.5rem' }}>Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['React', 'JavaScript', 'Python', 'AI / ML', 'System Design', 'Flutter', 'DevOps'].map(topic => (
              <span key={topic} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Hash size={14} /> {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Who to Follow */}
        {whoToFollow.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '2px dashed var(--muted-color)', paddingBottom: '0.5rem' }}>Who to Follow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {whoToFollow.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src={`/avatars/${u.avatarId || 'avatar1'}.svg`} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--fg-color)' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.company || 'Indie Developer'}</div>
                  </div>
                  <button
                    onClick={() => handleFollow(u.id)}
                    style={{ background: 'var(--card-bg)', border: '2px solid var(--muted-color)', borderRadius: '15px', padding: '0.2rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Patrick Hand', cursive" }}
                  >
                    {myFollowingIds.includes(u.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------- */}
      {/* CENTER FEED */}
      {/* --------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        {/* Create Post Card */}
        <SketchCard decoration="clip" style={{ transform: 'rotate(0.5deg)', padding: '2rem' }}>
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <img
                src={`/avatars/${user?.avatarId || 'avatar1'}.svg`}
                alt="My Avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid var(--fg-color)' }}
              />
              <textarea
                className="sketch-input"
                placeholder={"What are you working on?\nAsk for help, share knowledge,\nshow your project or discuss ideas."}
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                rows={4}
                maxLength={2000}
                style={{ flex: 1, fontSize: '1.3rem', lineHeight: '1.5', resize: 'vertical' }}
              />
            </div>

            <div style={{ padding: '1rem', background: 'var(--muted-color)', borderRadius: '8px', border: '1px dashed var(--fg-color)' }}>
              <strong style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Choose Post Type</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {POST_TYPES.map(pt => (
                  <button
                    key={pt.tag}
                    type="button"
                    onClick={() => handlePostTypeSelect(pt.tag)}
                    style={{
                      background: pt.color,
                      border: '1px solid var(--fg-color)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: "'Patrick Hand', cursive",
                      cursor: 'pointer'
                    }}
                  >
                    {pt.icon} {pt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <SketchButton primary type="submit" disabled={!newPostContent.trim()} style={{ fontSize: '1.2rem', padding: '0.6rem 2rem' }}>
                <Send size={18} /> Post
              </SketchButton>
            </div>
          </form>
        </SketchCard>

        {/* Feed Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.8rem', fontFamily: "'Kalam', cursive", opacity: 0.7 }}>
              Loading the latest updates... ✍️
            </div>
          ) : (
            <>
              {/* People You Follow (Only visible on Following tab) */}
              {activeTab === 'Following' && myFollowingIds.length > 0 && (
                <div style={{ marginBottom: '1.5rem', borderBottom: '2px dashed var(--muted-color)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontFamily: "'Patrick Hand', cursive", color: 'var(--text-muted)' }}>People You Follow</h3>
                  <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {allUsersData.filter(u => myFollowingIds.includes(u.id)).map(u => (
                      <div key={u.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                        <img src={`/avatars/${u.avatarId || 'avatar1'}.svg`} alt={u.name} title={u.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--fg-color)' }} />
                        <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px', fontWeight: 'bold' }}>{u.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {posts.filter(p => {
                if (activeTab === 'All Posts') return true;
                if (activeTab === 'My Posts') return p.authorId === user?.userId;
                if (activeTab === 'Following') return myFollowingIds.includes(p.authorId);
                return true;
              }).map((post, index) => {
            const decorations = ['tape', 'tack', 'clip', null];
            const decoration = decorations[index % decorations.length];
            const { text, tags } = extractTags(post.content);

            return (
              <SketchCard key={post.id} decoration={decoration} style={{ transform: `rotate(${index % 2 === 0 ? -0.5 : 0.8}deg)` }}>

                {/* Post Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                  <img
                    src={`/avatars/${post.authorAvatarId || 'avatar1'}.svg`}
                    alt={post.authorName}
                    style={{ width: '65px', height: '65px', borderRadius: '50%', border: '3px solid var(--fg-color)', background: '#fff' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{post.authorName}</h3>
                          {post.authorId !== user?.userId && (
                            <button
                              onClick={() => handleFollow(post.authorId)}
                              style={{
                                background: 'var(--card-bg)',
                                border: '2px solid var(--muted-color)',
                                borderRadius: '15px',
                                padding: '0.1rem 0.5rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                fontFamily: "'Patrick Hand', cursive"
                              }}
                            >
                              {myFollowingIds.includes(post.authorId) ? 'Following' : 'Follow'}
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: '1rem', opacity: 0.7 }}>Developer • {post.authorTechStack?.[0] || 'Learning'}</div>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: "'Kalam', cursive" }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Skill Tags */}
                    {post.authorTechStack && post.authorTechStack.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        {post.authorTechStack.slice(0, 3).map(tech => (
                          <TechStackBadge key={tech} text={tech} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <p style={{ fontSize: '1.3rem', whiteSpace: 'pre-wrap', marginBottom: '1.5rem', lineHeight: '1.6', background: 'var(--muted-color)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
                  {text}
                </p>

                {/* Intent Badges from Tags */}
                {tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {tags.map(tag => {
                      const postType = POST_TYPES.find(pt => pt.tag === tag);
                      return (
                        <span key={tag} style={{
                          background: postType ? postType.color : 'var(--muted-color)',
                          color: postType ? '#2d2d2d' : 'var(--fg-color)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          border: '1px solid var(--fg-color)',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          {postType ? postType.icon : '🏷️'} {postType ? postType.label : tag}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Interaction Bar */}
                <div style={{ display: 'flex', gap: '1rem', borderTop: '2px dashed var(--muted-color)', paddingTop: '1rem' }}>
                  <SketchButton
                    style={{
                      flex: 1, justifyContent: 'center', padding: '0.5rem',
                      background: post.myReaction === 'LIKE' ? '#ffaaa5' : 'transparent',
                      color: post.myReaction === 'LIKE' ? 'var(--bg-color)' : 'var(--fg-color)',
                      border: post.myReaction === 'LIKE' ? '2px solid var(--fg-color)' : '2px dashed var(--muted-color)'
                    }}
                    onClick={() => handleReact(post.id, 'LIKE')}
                  >
                    <Heart size={20} fill={post.myReaction === 'LIKE' ? 'currentColor' : 'none'} /> Appreciate
                  </SketchButton>

                  <SketchButton
                    style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', border: '2px dashed var(--muted-color)' }}
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageSquare size={20} /> Discuss
                  </SketchButton>

                  <SketchButton
                    style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', border: '2px dashed var(--muted-color)' }}
                    onClick={() => setActiveModalPostId(post.id)}
                  >
                    <Handshake size={20} /> Request Session
                  </SketchButton>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                  <span><strong>{post.likeCount}</strong> Appreciations</span>
                  <span><strong>{post.commentCount}</strong> Discussions</span>
                </div>

                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem' }}>
                      <img src={`/avatars/${user?.avatarId || 'avatar1'}.svg`} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--fg-color)' }} />
                      <input
                        className="sketch-input"
                        placeholder="Share your thoughts..."
                        style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '25px', fontSize: '1.1rem' }}
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {commentsData[post.id]?.map(comment => renderCommentNode(comment, post.id))}
                    </div>
                  </div>
                )}

              </SketchCard>
            );
          })}
            </>
          )}
        </div>
      </div>

      {/* --------------------------------------------------- */}
      {/* RIGHT SIDEBAR */}
      {/* --------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'sticky', top: '2rem' }}>

        {/* Trending Topics */}
        <SketchCard decoration="tack" style={{ transform: 'rotate(1deg)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trending Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['React', 'AI', 'System Design', 'Next.js', 'DevOps'].map(topic => (
              <span key={topic} style={{ fontSize: '1.2rem', fontFamily: "'Patrick Hand', cursive", color: 'var(--accent-color)' }}>
                #{topic}
              </span>
            ))}
          </div>
        </SketchCard>

        {/* People Are Looking For */}
        <SketchCard decoration="tape" style={{ transform: 'rotate(-0.5deg)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>People Are Looking For</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontFamily: "'Patrick Hand', cursive" }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#a8e6cf' }}>●</span> Open to Work</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#ffd3b6' }}>●</span> Collaborating</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#ffaaa5' }}>●</span> Learning</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#ff8b94', marginRight: '0.5rem' }}>●</span> Need Help</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#c5a3ff' }}>●</span> Projects</span>
            </li>
          </ul>
        </SketchCard>

        {/* Popular Questions */}
        <SketchCard decoration="clip" style={{ transform: 'rotate(0.5deg)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Popular Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'Kalam', cursive", fontSize: '1.1rem' }}>
            <p style={{ margin: 0, opacity: 0.8 }}>"Best resources for System Design?"</p>
            <p style={{ margin: 0, opacity: 0.8 }}>"Looking for React teammates"</p>
            <p style={{ margin: 0, opacity: 0.8 }}>"How to prepare for SDE interviews?"</p>
          </div>
        </SketchCard>

        {/* Suggested Connections */}
        <SketchCard decoration="tack" style={{ transform: 'rotate(-1deg)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}><Users size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Suggested Connections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {suggestedUsers.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={`/avatars/${u.avatarId || 'avatar1'}.svg`} alt="Avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--fg-color)' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.company || 'Indie Developer'}</div>
                </div>
                <SketchButton
                  onClick={() => handleFollow(u.id)}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.9rem' }}
                >
                  {myFollowingIds.includes(u.id) ? 'Following' : 'Follow'}
                </SketchButton>
              </div>
            ))}
          </div>
        </SketchCard>

      </div>

      {activeModalPostId && (
        <SessionRequestModal
          onClose={() => setActiveModalPostId(null)}
          onSubmit={handleSessionRequest}
        />
      )}
    </div>
  );
};

export default FeedPage;
