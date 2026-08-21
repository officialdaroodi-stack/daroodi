import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const tierName = product.collection?.tier || 'bespoke';
  const displayPrice = product.sale_price_gbp || product.base_price_gbp;

  return (
    <article className="product-luxury-card">
      <Link href={`/shop/${product.slug}`} className="card-img-wrapper">
        <img
          src={product.featured_image_url}
          alt={product.title}
          loading="lazy"
        />
        <span className="card-tier-badge">
          <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} />
          {tierName}
        </span>
      </Link>

      <div className="card-body">
        <h3 className="card-title">
          <Link href={`/shop/${product.slug}`}>{product.title}</Link>
        </h3>

        {product.acf_meta.embroidery_technique && (
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '8px', lineHeight: 1.4 }}>
            {product.acf_meta.embroidery_technique}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px' }}>
          <div className="card-price">
            {product.regular_price_gbp && product.sale_price_gbp && (
              <span style={{ textDecoration: 'line-through', color: 'var(--slate-400)', fontSize: '0.9rem', marginRight: '8px' }}>
                £{product.regular_price_gbp}
              </span>
            )}
            £{displayPrice}
          </div>

          <Link
            href={`/shop/${product.slug}`}
            className="btn-3d-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '4px' }}
          >
            Customize <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};
