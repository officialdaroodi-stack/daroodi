'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPages, savePage, deletePage } from '@/lib/db/pages';
import { CMSPage } from '@/lib/types';
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
  excerpt: '',
  content: '',
  featuredImage: '',
  status: 'published' as 'draft' | 'published',
  showInFooter: false,
  seoTitle: '',
  seoDescription: '',
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadPages = async () => {
    const data = await getPages(true);
    setPages([...data].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')));
  };

  useEffect(() => {
    loadPages();
  }, []);

  const openNew = () => {
    setEditingPage(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (page: CMSPage) => {
    setEditingPage(page);
    setForm({
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt || '',
      content: page.content,
      featuredImage: page.featured_image_url || '',
      status: page.status,
      showInFooter: !!page.show_in_footer,
      seoTitle: page.seo_title || '',
      seoDescription: page.seo_description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page permanently?')) return;
    await deletePage(id);
    await loadPages();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug =
      form.slug.trim() ||
      form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await savePage({
      id: editingPage ? editingPage.id : `page-${Date.now()}`,
      slug: finalSlug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      featured_image_url: form.featuredImage || undefined,
      status: form.status,
      show_in_footer: form.showInFooter,
      seo_title: form.seoTitle || undefined,
      seo_description: form.seoDescription || undefined,
      created_at: editingPage?.created_at || new Date().toISOString(),
    });

    await loadPages();
    setShowModal(false);
    alert(form.status === 'published' ? `"${form.title}" is live at /pages/${finalSlug}` : `"${form.title}" saved as draft`);
  };

  const filtered = pages.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0 }}>Pages</h1>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
            Create standalone storefront pages (like WordPress Pages). Published pages are served at <code>/pages/your-slug</code>.
          </p>
        </div>
        <button
          onClick={openNew}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#162923', color: '#C9A84C', padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, border: '1px solid #C9A84C', cursor: 'pointer' }}
        >
          <Plus size={15} /> Add New Page
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ position: 'relative', maxWidth: '420px', marginBottom: '18px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          type="text"
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E5E0D8', fontSize: '13px' }}
        />
      </div>

      {/* Pages table */}
      <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F9F7F2', textAlign: 'left', color: '#777', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px' }}>Page</th>
              <th style={{ padding: '12px 16px' }}>URL</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Updated</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: '#999' }}>
                  <FileText size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
                  No pages found. Click “Add New Page” to build one.
                </td>
              </tr>
            )}
            {filtered.map((page) => (
              <tr key={page.id} style={{ borderTop: '1px solid #F4F1EA' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#162923' }}>{page.title}</div>
                  {page.excerpt && <div style={{ fontSize: '11px', color: '#999', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.excerpt}</div>}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#555' }}>
                  /pages/{page.slug}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: page.status === 'published' ? '#E8F5E9' : '#FFF8E1',
                      color: page.status === 'published' ? '#1B5E20' : '#8A6D2B',
                      border: `1px solid ${page.status === 'published' ? '#C8E6C9' : '#F0E0B0'}`,
                    }}
                  >
                    {page.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#555', whiteSpace: 'nowrap', fontSize: '12px' }}>
                  {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : new Date(page.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    {page.status === 'published' && (
                      <Link
                        href={`/pages/${page.slug}`}
                        target="_blank"
                        title="View on storefront"
                        style={{ background: '#F4F9F5', border: '1px solid #C8E6C9', color: '#162923', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}
                      >
                        <ExternalLink size={12} /> View
                      </Link>
                    )}
                    <button
                      onClick={() => openEdit(page)}
                      style={{ background: '#F4F9F5', border: '1px solid #C8E6C9', color: '#162923', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#C53030', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── PAGE EDITOR MODAL ─────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '860px', maxHeight: '92vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#162923', color: '#FFFFFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#C9A84C' }}>
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Page Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Bespoke Wedding Party Packages" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Slug (URL)</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Featured Image URL (optional)</label>
                  <input type="text" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="/uploads/2026/05/…" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '12px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Excerpt / Subtitle</label>
                <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Page Content (Markdown supported)</label>
                <textarea rows={10} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder={'### Section Heading\n\nYour page content…'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontFamily: 'monospace', fontSize: '13px' }} />
              </div>

              {/* SEO */}
              <div style={{ background: '#F9F7F2', border: '1px solid #E5E0D8', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#162923', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO Settings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="SEO title (defaults to page title)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }} />
                  <textarea rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder="Meta description" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#162923' }}>
                    Status:
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontWeight: 700 }}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.showInFooter} onChange={(e) => setForm({ ...form, showInFooter: e.target.checked })} />
                    List in footer nav
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E0D8', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '10px 28px', borderRadius: '8px', background: '#162923', color: '#C9A84C', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                    {form.status === 'published' ? 'Publish Page' : 'Save Draft'}
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
