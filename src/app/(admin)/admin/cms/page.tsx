'use client';

import React, { useState, useEffect } from 'react';
import { getReviews } from '@/lib/db/reviews';
import { getQuestions, answerQuestion } from '@/lib/db/questions';
import { INITIAL_JOURNAL_POSTS } from '@/lib/mockData';
import { ProductReview, ProductQuestion, JournalPost } from '@/lib/types';
import {
  Star,
  MessageCircle,
  Check,
  X,
  ShieldCheck,
  ThumbsUp,
  Send,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  FileText,
} from 'lucide-react';

const JOURNAL_STORAGE_KEY = 'daroodi_db_journal_posts';

export default function AdminCMSPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>(INITIAL_JOURNAL_POSTS);
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'reviews' | 'qna'>('journal');
  
  // Q&A State
  const [answeringQId, setAnsweringQId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');

  // Journal Editor Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postAuthor, setPostAuthor] = useState('Sarmad Daroodi, Creative Director');
  const [postCategory, setPostCategory] = useState('Bespoke Craftsmanship');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCoverImage, setPostCoverImage] = useState('/uploads/2026/05/craftsmanship.jpg');
  const [postReadTime, setPostReadTime] = useState(5);
  const [postStatus, setPostStatus] = useState<'draft' | 'published'>('published');

  const loadData = async () => {
    const r = await getReviews();
    const q = await getQuestions();
    setReviews(r);
    setQuestions(q);

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (stored) {
        setJournalPosts(JSON.parse(stored));
      } else {
        localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(INITIAL_JOURNAL_POSTS));
        setJournalPosts(INITIAL_JOURNAL_POSTS);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveJournalPostsToStorage = (posts: JournalPost[]) => {
    setJournalPosts(posts);
    if (typeof window !== 'undefined') {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(posts));
    }
  };

  const handleOpenAddPost = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostSlug('');
    setPostAuthor('Sarmad Daroodi, Creative Director');
    setPostCategory('Bespoke Craftsmanship');
    setPostExcerpt('');
    setPostContent(`### The Heritage of Handcrafted Luxury\n\nEvery stitch at Daroodi tells a story of generations-old embroidery techniques...`);
    setPostCoverImage('/uploads/2026/05/craftsmanship.jpg');
    setPostReadTime(5);
    setPostStatus('published');
    setShowPostModal(true);
  };

  const handleOpenEditPost = (post: JournalPost) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setPostAuthor(post.author || post.author_name || 'Master Artisan');
    setPostCategory(post.category || 'Editorial');
    setPostExcerpt(post.excerpt);
    setPostContent(post.content || post.content_markdown || '');
    setPostCoverImage(post.cover_image_url || post.featured_image_url || '/uploads/2026/05/craftsmanship.jpg');
    setPostReadTime(post.read_time_minutes || post.read_time_mins || 5);
    setPostStatus(post.status || 'published');
    setShowPostModal(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this journal post permanently?')) {
      const filtered = journalPosts.filter(p => p.id !== id);
      saveJournalPostsToStorage(filtered);
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = postSlug || postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPost: JournalPost = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      slug: finalSlug,
      title: postTitle,
      excerpt: postExcerpt,
      content: postContent,
      content_markdown: postContent,
      cover_image_url: postCoverImage,
      featured_image_url: postCoverImage,
      author: postAuthor,
      author_name: postAuthor,
      category: postCategory,
      read_time_minutes: Number(postReadTime),
      read_time_mins: Number(postReadTime),
      published_at: editingPost?.published_at || new Date().toISOString().split('T')[0],
      status: postStatus,
    };

    let updated: JournalPost[];
    if (editingPost) {
      updated = journalPosts.map(p => p.id === editingPost.id ? newPost : p);
    } else {
      updated = [newPost, ...journalPosts];
    }

    saveJournalPostsToStorage(updated);
    alert(`Journal post "${postTitle}" published successfully!`);
    setShowPostModal(false);
  };

  const handlePublishAnswer = async (qId: string) => {
    if (!answerDraft.trim()) return;
    await answerQuestion(qId, answerDraft.trim());
    await loadData();
    setAnsweringQId(null);
    setAnswerDraft('');
    alert('Answer published and synced to product page!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0 }}>
          CMS &amp; Editorial Management
        </h1>
        <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
          Publish Journal stories, moderate client reviews, and answer atelier tailoring questions.
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveSubTab('journal')}
          style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: '1px solid #162923', background: activeSubTab === 'journal' ? '#162923' : '#fff', color: activeSubTab === 'journal' ? '#C9A84C' : '#162923', cursor: 'pointer' }}
        >
          📰 The Daroodi Journal ({journalPosts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('reviews')}
          style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: '1px solid #162923', background: activeSubTab === 'reviews' ? '#162923' : '#fff', color: activeSubTab === 'reviews' ? '#C9A84C' : '#162923', cursor: 'pointer' }}
        >
          ★ Verified Client Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveSubTab('qna')}
          style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: '1px solid #162923', background: activeSubTab === 'qna' ? '#162923' : '#fff', color: activeSubTab === 'qna' ? '#C9A84C' : '#162923', cursor: 'pointer' }}
        >
          💬 Product Inquiries &amp; Q&amp;A ({questions.length})
        </button>
      </div>

      {/* ─── TAB 1: JOURNAL POSTS ──────────────────────────────────── */}
      {activeSubTab === 'journal' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#162923' }}>Published Editorial Articles</h2>
            <button
              onClick={handleOpenAddPost}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#162923', color: '#C9A84C', padding: '10px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, border: '1px solid #C9A84C', cursor: 'pointer' }}
            >
              <Plus size={14} /> Write New Journal Post
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {journalPosts.map((post) => (
              <div key={post.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E0D8', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', background: '#162923', overflow: 'hidden' }}>
                  <img
                    src={post.cover_image_url || post.featured_image_url || '/uploads/2026/05/craftsmanship.jpg'}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase' }}>
                      {post.category || 'Atelier Journal'} · {post.published_at}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162923', margin: '6px 0 8px', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F0ECE4' }}>
                    <span style={{ fontSize: '11px', color: '#888' }}>By {post.author || 'Atelier Ustad'}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEditPost(post)} style={{ background: '#F4F9F5', color: '#162923', border: '1px solid #C8E6C9', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeletePost(post.id)} style={{ background: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: REVIEWS MODERATION ─────────────────────────────── */}
      {activeSubTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reviews.length === 0 ? (
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid #E5E0D8' }}>
              <Star size={32} color="#C9A84C" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#666', fontSize: '14px' }}>No pending client reviews awaiting moderation.</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} style={{ background: '#fff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E5E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{r.author_name}</strong>
                    <span style={{ color: '#D97706', fontSize: '12px' }}>{'★'.repeat(r.rating)}</span>
                    <span style={{ background: '#E8F5E9', color: '#1B5E20', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>Verified Buyer</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#444' }}>{r.comment}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: '#162923', color: '#C9A84C', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                  <button style={{ background: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── TAB 3: Q&A MODERATION ──────────────────────────────────── */}
      {activeSubTab === 'qna' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {questions.length === 0 ? (
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid #E5E0D8' }}>
              <MessageCircle size={32} color="#162923" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#666', fontSize: '14px' }}>No unanswered client questions at this moment.</p>
            </div>
          ) : (
            questions.map((q) => (
              <div key={q.id} style={{ background: '#fff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E5E0D8' }}>
                <strong style={{ color: '#162923', fontSize: '14px', display: 'block' }}>Q: {q.question}</strong>
                <span style={{ fontSize: '11px', color: '#888' }}>Asked by {q.user_name || q.author_name || 'Client'}</span>

                {q.answer ? (
                  <div style={{ marginTop: '10px', background: '#F4F9F5', padding: '10px', borderRadius: '8px', border: '1px solid #C8E6C9', fontSize: '13px', color: '#162923' }}>
                    <strong>A: </strong> {q.answer}
                  </div>
                ) : (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Write verified answer from master tailor..."
                      value={answeringQId === q.id ? answerDraft : ''}
                      onChange={(e) => {
                        setAnsweringQId(q.id);
                        setAnswerDraft(e.target.value);
                      }}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }}
                    />
                    <button
                      onClick={() => handlePublishAnswer(q.id)}
                      style={{ background: '#162923', color: '#C9A84C', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Publish Answer
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── JOURNAL POST WRITER & EDITOR MODAL ─────────────────────── */}
      {showPostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            
            <div style={{ background: '#162923', color: '#FFFFFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#C9A84C' }}>
                {editingPost ? 'Edit Journal Story' : 'Write New Journal Story'}
              </h2>
              <button onClick={() => setShowPostModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSavePost} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Story Title</label>
                <input type="text" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="e.g. The Craft of Hand Bullion Embroidery" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category</label>
                  <input type="text" value={postCategory} onChange={(e) => setPostCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Author</label>
                  <input type="text" value={postAuthor} onChange={(e) => setPostAuthor(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Cover Image Path / URL</label>
                  <input type="text" value={postCoverImage} onChange={(e) => setPostCoverImage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Read Time (Mins)</label>
                  <input type="number" value={postReadTime} onChange={(e) => setPostReadTime(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Short Summary / Excerpt</label>
                <textarea rows={2} required value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Story (Markdown / Rich Content)</label>
                <textarea rows={8} required value={postContent} onChange={(e) => setPostContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowPostModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E0D8', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 28px', borderRadius: '8px', background: '#162923', color: '#C9A84C', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Publish Story</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
