'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJournalPosts, saveJournalPost, deleteJournalPost } from '@/lib/db/journal';
import { JournalPost } from '@/lib/types';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  FileText,
} from 'lucide-react';

const emptyForm = {
  title: '',
  slug: '',
  author: 'Sarmad Daroodi, Creative Director',
  category: 'Bespoke Craftsmanship',
  tags: '',
  excerpt: '',
  content: '',
  cover: '/uploads/2026/05/craftsmanship.jpg',
  readTime: 5,
  status: 'published' as 'draft' | 'published',
  seoTitle: '',
  seoDescription: '',
  publishedAt: '',
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadPosts = async () => {
    const data = await getJournalPosts();
    setPosts([...data].sort((a, b) => (b.published_at || '').localeCompare(a.published_at || '')));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openNew = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (post: JournalPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      author: post.author || post.author_name || 'Master Artisan',
      category: post.category || 'Editorial',
      tags: (post.tags || []).join(', '),
      excerpt: post.excerpt,
      content: post.content || post.content_markdown || '',
      cover: post.cover_image_url || post.featured_image_url || '/uploads/2026/05/craftsmanship.jpg',
      readTime: post.read_time_minutes || post.read_time_mins || 5,
      status: post.status || 'published',
      seoTitle: post.seo_title || '',
      seoDescription: post.seo_description || '',
      publishedAt: post.published_at || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Move this post to trash permanently?')) return;
    await deleteJournalPost(id);
    await loadPosts();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug =
      form.slug.trim() ||
      form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const post: JournalPost = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      slug: finalSlug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      content_markdown: form.content,
      cover_image_url: form.cover,
      featured_image_url: form.cover,
      author: form.author,
      author_name: form.author,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      read_time_minutes: Number(form.readTime),
      read_time_mins: Number(form.readTime),
      published_at: form.publishedAt || editingPost?.published_at || new Date().toISOString().split('T')[0],
      status: form.status,
      seo_title: form.seoTitle || undefined,
      seo_description: form.seoDescription || undefined,
    };

    await saveJournalPost(post);
    await loadPosts();
    setShowModal(false);
    alert(form.status === 'published' ? `"${form.title}" is live on /journal/${finalSlug}` : `"${form.title}" saved as draft`);
  };

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (p.status || 'published') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = posts.filter((p) => (p.status || 'published') === 'published').length;
  const draftCount = posts.length - publishedCount;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0 }}>
            Posts — The Daroodi Journal
          </h1>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
            {publishedCount} published · {draftCount} draft{draftCount === 1 ? '' : 's'}. Published posts appear instantly at{' '}
            <Link href="/journal" target="_blank" style={{ color: '#162923', fontWeight: 700 }}>/journal</Link>.
          </p>
        </div>
        <button
          onClick={openNew}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#162923', color: '#C9A84C', padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, border: '1px solid #C9A84C', cursor: 'pointer' }}
        >
          <Plus size={15} /> Add New Post
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search posts by title or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E5E0D8', fontSize: '13px' }}
          />
        </div>
        {(['all', 'published', 'draft'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #162923', background: statusFilter === s ? '#162923' : '#fff', color: statusFilter === s ? '#C9A84C' : '#162923', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Posts table */}
      <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F9F7F2', textAlign: 'left', color: '#777', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px' }}>Title</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Author</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#999' }}>
                  <FileText size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
                  No posts found. Click “Add New Post” to write your first story.
                </td>
              </tr>
            )}
            {filtered.map((post) => (
              <tr key={post.id} style={{ borderTop: '1px solid #F4F1EA' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={post.cover_image_url || post.featured_image_url || '/uploads/2026/05/craftsmanship.jpg'}
                      alt=""
                      style={{ width: '52px', height: '38px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#162923' }}>{post.title}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>/{post.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{post.category || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{post.author || post.author_name || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#555', whiteSpace: 'nowrap' }}>{post.published_at}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: (post.status || 'published') === 'published' ? '#E8F5E9' : '#FFF8E1',
                      color: (post.status || 'published') === 'published' ? '#1B5E20' : '#8A6D2B',
                      border: `1px solid ${(post.status || 'published') === 'published' ? '#C8E6C9' : '#F0E0B0'}`,
                    }}
                  >
                    {post.status || 'published'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <Link
                      href={`/journal/${post.slug}`}
                      target="_blank"
                      title="View on storefront"
                      style={{ background: '#F4F9F5', border: '1px solid #C8E6C9', color: '#162923', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} /> View
                    </Link>
                    <button
                      onClick={() => openEdit(post)}
                      style={{ background: '#F4F9F5', border: '1px solid #C8E6C9', color: '#162923', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#C53030', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Trash2 size={12} /> Trash
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── POST EDITOR MODAL ─────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '860px', maxHeight: '92vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#162923', color: '#FFFFFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#C9A84C' }}>
                {editingPost ? 'Edit Post' : 'Add New Post'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. The Craft of Hand Bullion Embroidery" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Slug (URL)</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Publish Date</label>
                  <input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tags (comma separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="zardozi, prince coat" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Read Time (mins)</label>
                  <input type="number" min={1} value={form.readTime} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Author</label>
                  <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Featured Image Path / URL</label>
                  <input type="text" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '12px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Excerpt</label>
                <textarea rows={2} required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Content (Markdown supported — ### headings, **bold**, lists)</label>
                <textarea rows={10} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '13px' }} />
              </div>

              {/* SEO */}
              <div style={{ background: '#F9F7F2', border: '1px solid #E5E0D8', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#162923', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO Settings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="SEO title (defaults to post title)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }} />
                  <textarea rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder="Meta description (defaults to excerpt)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#162923' }}>
                  Status:
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontWeight: 700 }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E0D8', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '10px 28px', borderRadius: '8px', background: '#162923', color: '#C9A84C', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                    {form.status === 'published' ? 'Publish' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
