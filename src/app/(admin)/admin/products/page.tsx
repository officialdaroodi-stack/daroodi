'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, saveProduct, deleteProduct } from '@/lib/db/products';
import { INITIAL_COLLECTIONS } from '@/lib/mockData';
import { Product, ProductColor, ProductFAQ } from '@/lib/types';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Check,
  X,
  Image as ImageIcon,
  Layers,
  HelpCircle,
  Scissors,
  Palette,
  Upload,
  Loader2,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'acf' | 'accordions' | 'media'>('general');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [collectionId, setCollectionId] = useState('col-platinum');
  const [basePrice, setBasePrice] = useState(1450);
  const [regularPrice, setRegularPrice] = useState(1650);
  const [salePrice, setSalePrice] = useState(1450);
  const [description, setDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
    '/uploads/2026/06/Mens-Premium-Prince-Coat-2.webp',
    '/uploads/2026/06/Mens-Premium-Prince-Coat-3.webp',
  ]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'made_to_order' | 'out_of_stock'>('in_stock');
  const [stockQty, setStockQty] = useState(5);
  const [leadTime, setLeadTime] = useState(4);

  // ACF & Tailoring Specs
  const [fabricComp, setFabricComp] = useState('100% Italian Silk Micro-Velvet (520 GSM)');
  const [embroideryTech, setEmbroideryTech] = useState('Hand Zardozi with Metallic Gold Bullion');
  const [embroideryHours, setEmbroideryHours] = useState(120);
  const [careInstructions, setCareInstructions] = useState('Specialist Dry Clean Only.');
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Imperial Emerald', hex: '#162923' },
    { name: 'Royal Midnight Navy', hex: '#0D1B2A' },
    { name: 'Sovereign Black', hex: '#0A0A0A' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#C9A84C');

  // Accordion Content Data
  const [accDescription, setAccDescription] = useState('Handcrafted with pure metallic bullion zari and floating horsehair canvas.');
  const [accSizing, setAccSizing] = useState('Standard XS-3XL sizing available or enter bespoke measurements for made-to-measure.');
  const [accCare, setAccCare] = useState('Keep in archival cloth bag. Specialist dry clean only.');
  const [faqs, setFaqs] = useState<ProductFAQ[]>([
    { question: 'What is the production lead time?', answer: 'Ready to ship sizes dispatch within 48h. Bespoke orders take 3-4 weeks.' },
    { question: 'Is worldwide DHL Express shipping included?', answer: 'Yes, all orders include complimentary fully-insured international DHL Express shipping.' },
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setCollectionId('col-platinum');
    setBasePrice(1450);
    setRegularPrice(1650);
    setSalePrice(1450);
    setDescription('');
    setFeaturedImage('/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp');
    setGalleryImages(['/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp']);
    setFabricComp('100% Italian Silk Micro-Velvet (520 GSM)');
    setEmbroideryTech('Hand Zardozi with Metallic Gold Bullion');
    setEmbroideryHours(120);
    setCareInstructions('Specialist Dry Clean Only.');
    setStockStatus('in_stock');
    setStockQty(5);
    setLeadTime(4);
    setActiveTab('general');
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCollectionId(p.collection_id);
    setBasePrice(p.base_price_gbp);
    setRegularPrice(p.regular_price_gbp || Math.round(p.base_price_gbp * 1.25));
    setSalePrice(p.sale_price_gbp || p.base_price_gbp);
    setDescription(p.description);
    setFeaturedImage(p.featured_image_url);
    setGalleryImages(p.gallery_images && p.gallery_images.length > 0 ? p.gallery_images : [p.featured_image_url]);
    setFabricComp(p.acf_meta?.fabric_composition || '100% Italian Silk Micro-Velvet');
    setEmbroideryTech(p.acf_meta?.embroidery_technique || 'Hand Zardozi Bullion');
    setEmbroideryHours(p.acf_meta?.embroidery_hours || 100);
    setCareInstructions(p.acf_meta?.care_instructions || 'Specialist Dry Clean Only.');
    setColors(p.acf_meta?.product_colors || [{ name: 'Imperial Emerald', hex: '#162923' }]);
    setAccDescription(p.acf_meta?.accordion_description || p.description);
    setAccSizing(p.acf_meta?.accordion_sizing || 'Bespoke custom pattern drafted to your exact measurements.');
    setAccCare(p.acf_meta?.accordion_care || 'Specialist Dry Clean Only.');
    setFaqs(p.acf_meta?.product_faqs || [
      { question: 'What is the lead time?', answer: '3-4 weeks for bespoke tailored creation.' }
    ]);
    setStockStatus(p.stock_status);
    setStockQty(p.stock_quantity || 5);
    setLeadTime(p.lead_time_weeks);
    setActiveTab('general');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this piece from the database?')) {
      await deleteProduct(id);
      await loadData();
    }
  };

  const handleAddColor = () => {
    if (!newColorName) return;
    setColors([...colors, { name: newColorName, hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    setFaqs([...faqs, { question: newFaqQ, answer: newFaqA }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl) return;
    setGalleryImages([...galleryImages, newGalleryUrl]);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const handleUploadFeatured = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setFeaturedImage(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) {
          newUrls.push(data.url);
        }
      }
      if (newUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...newUrls]);
      }
    } catch (err: any) {
      alert('Gallery upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const selectedCol = INITIAL_COLLECTIONS.find(c => c.id === collectionId) || INITIAL_COLLECTIONS[0];

    const prodToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug: finalSlug,
      title,
      collection_id: collectionId,
      collection: selectedCol,
      base_price_gbp: Number(basePrice),
      regular_price_gbp: Number(regularPrice),
      sale_price_gbp: Number(salePrice),
      description,
      featured_image_url: featuredImage,
      gallery_images: galleryImages,
      stock_status: stockStatus,
      stock_quantity: Number(stockQty),
      is_featured: true,
      lead_time_weeks: Number(leadTime),
      acf_meta: {
        fabric_composition: fabricComp,
        embroidery_technique: embroideryTech,
        embroidery_hours: Number(embroideryHours),
        care_instructions: careInstructions,
        product_colors: colors,
        product_faqs: faqs,
        accordion_description: accDescription,
        accordion_sizing: accSizing,
        accordion_care: accCare,
        product_highlights: [
          { highlight: `${embroideryHours}+ hours of imperial hand needlework` },
          { highlight: 'Full floating horsehair canvas construction' },
          { highlight: 'Guaranteed bespoke custom fit drafting' },
        ],
      },
      created_at: editingProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveProduct(prodToSave);
    await loadData();
    alert(`Product "${title}" successfully synced with database!`);
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#162923', margin: 0 }}>
            Master Product Database &amp; WooCommerce Editor
          </h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            Manage bespoke garments, pricing tiers, ACF tailoring specs, and accordion content.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#162923', color: '#C9A84C', padding: '12px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', border: '1px solid #C9A84C', cursor: 'pointer' }}
        >
          <Plus size={16} /> Add New Masterpiece Piece
        </button>
      </div>

      {/* Products Grid Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E5E0D8', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8F6F3', borderBottom: '2px solid #E5E0D8' }}>
              <th style={{ padding: '14px 16px' }}>Garment</th>
              <th style={{ padding: '14px 16px' }}>Collection</th>
              <th style={{ padding: '14px 16px' }}>Base / Regular Price</th>
              <th style={{ padding: '14px 16px' }}>Stock &amp; Lead Time</th>
              <th style={{ padding: '14px 16px' }}>Embroidery Specs</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #E5E0D8' }}>
                <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={prod.featured_image_url}
                    alt={prod.title}
                    style={{ width: '50px', height: '62px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E0D8' }}
                  />
                  <div>
                    <strong style={{ color: '#162923', display: 'block', fontSize: '14px' }}>{prod.title}</strong>
                    <span style={{ fontSize: '11px', color: '#888' }}>/{prod.slug}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: '#162923', color: '#C9A84C', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                    {prod.collection?.tier || 'Platinum'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <strong style={{ color: '#162923', fontSize: '15px' }}>£{prod.base_price_gbp.toFixed(2)}</strong>
                  {prod.regular_price_gbp && (
                    <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '6px' }}>
                      £{prod.regular_price_gbp.toFixed(2)}
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: prod.stock_status === 'in_stock' ? '#1B5E20' : '#D97706' }}>
                    {prod.stock_status === 'in_stock' ? `● In Stock (${prod.stock_quantity || 1} units)` : '○ Made to Order'}
                  </div>
                  <small style={{ color: '#888' }}>{prod.lead_time_weeks} weeks lead time</small>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px' }}>{prod.acf_meta?.embroidery_technique || 'Hand Zardozi'}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{prod.acf_meta?.embroidery_hours || 100} hours needlework</div>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    style={{ background: '#F4F9F5', color: '#162923', border: '1px solid #C8E6C9', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, marginRight: '8px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    style={{ background: '#FFF5F5', color: '#C53030', border: '1px solid #FEB2B2', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── FULL WOOCOMMERCE PRODUCT EDITOR MODAL ────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            
            {/* Modal Header */}
            <div style={{ background: '#162923', color: '#FFFFFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#C9A84C' }}>
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Create New Masterpiece Garment'}
                </h2>
                <span style={{ fontSize: '11px', color: '#E5E0D8' }}>WooCommerce-style Full Catalog &amp; ACF Manager</span>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E5E0D8', background: '#F8F6F3' }}>
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                style={{ padding: '14px 20px', border: 'none', borderBottom: activeTab === 'general' ? '3px solid #162923' : '3px solid transparent', background: activeTab === 'general' ? '#FFFFFF' : 'transparent', fontWeight: 700, fontSize: '13px', color: activeTab === 'general' ? '#162923' : '#666', cursor: 'pointer' }}
              >
                1. General &amp; Pricing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('acf')}
                style={{ padding: '14px 20px', border: 'none', borderBottom: activeTab === 'acf' ? '3px solid #162923' : '3px solid transparent', background: activeTab === 'acf' ? '#FFFFFF' : 'transparent', fontWeight: 700, fontSize: '13px', color: activeTab === 'acf' ? '#162923' : '#666', cursor: 'pointer' }}
              >
                2. ACF &amp; Fabric Specs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('accordions')}
                style={{ padding: '14px 20px', border: 'none', borderBottom: activeTab === 'accordions' ? '3px solid #162923' : '3px solid transparent', background: activeTab === 'accordions' ? '#FFFFFF' : 'transparent', fontWeight: 700, fontSize: '13px', color: activeTab === 'accordions' ? '#162923' : '#666', cursor: 'pointer' }}
              >
                3. Accordions &amp; FAQs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                style={{ padding: '14px 20px', border: 'none', borderBottom: activeTab === 'media' ? '3px solid #162923' : '3px solid transparent', background: activeTab === 'media' ? '#FFFFFF' : 'transparent', fontWeight: 700, fontSize: '13px', color: activeTab === 'media' ? '#162923' : '#666', cursor: 'pointer' }}
              >
                4. Gallery &amp; Images
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* TAB 1: General */}
              {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Product Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '14px' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>URL Slug</label>
                      <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-from-title" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Collection Tier</label>
                      <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '13px' }}>
                        {INITIAL_COLLECTIONS.map(c => (
                          <option key={c.id} value={c.id}>{c.title} ({c.tier})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Base Price (GBP £)</label>
                      <input type="number" required value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Regular / Strikethrough Price (£)</label>
                      <input type="number" value={regularPrice} onChange={(e) => setRegularPrice(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Sale Price (£)</label>
                      <input type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Stock Status</label>
                      <select value={stockStatus} onChange={(e: any) => setStockStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
                        <option value="in_stock">In Stock (Ready to Ship)</option>
                        <option value="made_to_order">Made to Order</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Stock Quantity</label>
                      <input type="number" value={stockQty} onChange={(e) => setStockQty(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Lead Time (Weeks)</label>
                      <input type="number" value={leadTime} onChange={(e) => setLeadTime(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Short Description</label>
                    <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                  </div>
                </div>
              )}

              {/* TAB 2: ACF & Fabric Specs */}
              {activeTab === 'acf' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Fabric Composition</label>
                      <input type="text" value={fabricComp} onChange={(e) => setFabricComp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Embroidery Technique</label>
                      <input type="text" value={embroideryTech} onChange={(e) => setEmbroideryTech(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Hand Needlework Hours</label>
                      <input type="number" value={embroideryHours} onChange={(e) => setEmbroideryHours(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Care Instructions</label>
                      <input type="text" value={careInstructions} onChange={(e) => setCareInstructions(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                    </div>
                  </div>

                  {/* Color Swatches Manager */}
                  <div style={{ border: '1px solid #E5E0D8', borderRadius: '12px', padding: '16px', background: '#FAFAFA' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>Color Swatches</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {colors.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '6px 12px', borderRadius: '50px', border: '1px solid #E5E0D8' }}>
                          <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.hex, display: 'inline-block' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{c.name}</span>
                          <button type="button" onClick={() => handleRemoveColor(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>×</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" placeholder="Color Name (e.g. Royal Maroon)" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '12px' }} />
                      <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} style={{ width: '42px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                      <button type="button" onClick={handleAddColor} style={{ padding: '8px 16px', background: '#162923', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Add Color</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Accordions & FAQs */}
              {activeTab === 'accordions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Accordion: Garment Description &amp; Craftsmanship</label>
                    <textarea rows={3} value={accDescription} onChange={(e) => setAccDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Accordion: Bespoke Sizing &amp; Custom Fit Guide</label>
                    <textarea rows={2} value={accSizing} onChange={(e) => setAccSizing(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Accordion: Care &amp; Preservation</label>
                    <textarea rows={2} value={accCare} onChange={(e) => setAccCare(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8' }} />
                  </div>

                  {/* FAQ Manager */}
                  <div style={{ border: '1px solid #E5E0D8', borderRadius: '12px', padding: '16px', background: '#FAFAFA' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Product FAQs</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {faqs.map((f, idx) => (
                        <div key={idx} style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #E5E0D8', display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <strong>Q: {f.question}</strong>
                            <p style={{ margin: '4px 0 0', color: '#666', fontSize: '12px' }}>A: {f.answer}</p>
                          </div>
                          <button type="button" onClick={() => handleRemoveFaq(idx)} style={{ background: 'none', border: 'none', color: '#C53030', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input type="text" placeholder="Question..." value={newFaqQ} onChange={(e) => setNewFaqQ(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E5E0D8', fontSize: '12px' }} />
                      <input type="text" placeholder="Answer..." value={newFaqA} onChange={(e) => setNewFaqA(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E5E0D8', fontSize: '12px' }} />
                      <button type="button" onClick={handleAddFaq} style={{ padding: '8px', background: '#162923', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>Add FAQ</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Media & Gallery */}
              {activeTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Featured Image */}
                  <div style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: '12px', padding: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#162923', display: 'block', marginBottom: '8px' }}>
                      Primary Featured Image
                    </label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {featuredImage && (
                        <div style={{ position: 'relative', width: '90px', height: '115px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #C9A84C', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <img src={featuredImage} alt="Featured Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            required
                            placeholder="/uploads/2026/06/... or https://..."
                            value={featuredImage}
                            onChange={(e) => setFeaturedImage(e.target.value)}
                            style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '12px' }}
                          />
                          <label
                            style={{
                              padding: '9px 16px',
                              background: '#162923',
                              color: '#C9A84C',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: uploading ? 'wait' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            Upload New
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleUploadFeatured}
                              disabled={uploading}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          Upload image directly from device or paste an asset path/URL.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 800, color: '#162923', display: 'block' }}>
                          Product Photo Gallery ({galleryImages.length})
                        </label>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          High-resolution angles, embroidery close-ups &amp; lining details.
                        </span>
                      </div>
                      <label
                        style={{
                          padding: '9px 16px',
                          background: '#C9A84C',
                          color: '#0F241E',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: uploading ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(201, 168, 76, 0.3)',
                        }}
                      >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Upload Photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadGallery}
                          disabled={uploading}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {/* Thumbnails grid */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px', minHeight: '80px', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px dashed #DDD7CD' }}>
                      {galleryImages.length === 0 ? (
                        <div style={{ width: '100%', textAlign: 'center', padding: '16px', color: '#999', fontSize: '12px' }}>
                          No gallery images uploaded yet. Click "Upload Photos" above or paste URLs below.
                        </div>
                      ) : (
                        galleryImages.map((img, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              width: '85px',
                              height: '110px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '1px solid #E5E0D8',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                          >
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              title="Delete photo"
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(200, 30, 30, 0.85)',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                fontSize: '13px',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Manual URL input fallback */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Or paste image URL (/uploads/2026/06/...)"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E0D8', fontSize: '12px' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        style={{ padding: '8px 16px', background: '#162923', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E0D8' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #E5E0D8', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '12px', background: '#162923', color: '#C9A84C', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Save &amp; Publish</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
