'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReviews } from '@/lib/db/reviews';
import { getQuestions, answerQuestion } from '@/lib/db/questions';
import { ProductReview, ProductQuestion } from '@/lib/types';
import {
  Star,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

export default function AdminCMSPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'qna'>('reviews');

  // Q&A State
  const [answeringQId, setAnsweringQId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');

  const loadData = async () => {
    const r = await getReviews();
    const q = await getQuestions();
    setReviews(r);
    setQuestions(q);
  };

  useEffect(() => {
    loadData();
  }, []);

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
          Reviews &amp; Q&amp;A Moderation
        </h1>
        <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
          Moderate verified client reviews and answer atelier tailoring questions.
        </p>
      </div>

      {/* Journal shortcut banner — posts now live in the dedicated manager */}
      <Link
        href="/admin/posts"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#162923',
          border: '1px solid #C9A84C',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '24px',
          textDecoration: 'none',
        }}
      >
        <BookOpen size={20} color="#C9A84C" />
        <div>
          <div style={{ color: '#C9A84C', fontWeight: 800, fontSize: '13px' }}>
            Journal posts have moved
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>
            Write, edit and publish blog stories from the dedicated <strong>Posts</strong> manager →
          </div>
        </div>
      </Link>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
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

      {/* ─── TAB 1: REVIEWS MODERATION ─────────────────────────────── */}
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

      {/* ─── TAB 2: Q&A MODERATION ──────────────────────────────────── */}
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

    </div>
  );
}
