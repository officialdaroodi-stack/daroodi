import json
import os
import re

with open('/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/exact_23_products_with_meta.json') as f:
    raw_products = json.load(f)

# Check all available local files in public/uploads/2026/06 and public/uploads/2026/05
local_files_06 = set(os.listdir('/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/public/uploads/2026/06'))
local_files_05 = set(os.listdir('/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/public/uploads/2026/05'))

print(f"Available local files: {len(local_files_06)} in 06, {len(local_files_05)} in 05")

def get_best_image_path(url, fallback_list):
    if not url:
        return fallback_list[0] if fallback_list else '/uploads/2026/05/hero-coat.jpg'
    basename = url.split('/')[-1]
    if basename in local_files_06:
        return f"/uploads/2026/06/{basename}"
    if basename in local_files_05:
        return f"/uploads/2026/05/{basename}"
    # Try finding similar name
    clean_base = basename.split('-')[0]
    for lf in local_files_06:
        if clean_base.lower() in lf.lower() and not re.search(r'\d+x\d+', lf):
            return f"/uploads/2026/06/{lf}"
    # Fallback to provided list
    for fb in fallback_list:
        if fb.split('/')[-1] in local_files_06 or fb.split('/')[-1] in local_files_05:
            return fb
    return '/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer.webp'

products_ts = []

for i, p in enumerate(raw_products):
    title = p['title']
    slug = p['slug']
    price = p['price']
    regular_price = p['regular_price']
    sale_price = p['sale_price']
    
    # Determine Collection Tier & Category
    title_lower = title.lower()
    if 'duster' in title_lower or 'gown' in title_lower or 'opera' in title_lower or 'prince' in title_lower or 'taupe longline' in title_lower or 'champagne' in title_lower:
        col_id = 'col-platinum'
        tier = 'Platinum'
        hours = 120 + (i * 5) % 40
        fabric = '100% Italian Pure Silk Micro-Velvet (520 GSM) & Mulberry Silk Lining'
        emb_tech = 'Hand Zardozi with Pure 24k Gold Bullion, Metallic Dabka & French Knots'
    elif 'tuxedo' in title_lower or 'burgundy' in title_lower or 'gold floral' in title_lower or 'embellished' in title_lower:
        col_id = 'col-gold'
        tier = 'Gold'
        hours = 75 + (i * 4) % 30
        fabric = 'Pure Silk Jacquard Brocade & Super 140s Wool (480 GSM)'
        emb_tech = 'Intricate Gold & Silver Tilla Threadwork with Raised Velvet Relief'
    elif 'silver' in title_lower or 'linen' in title_lower or 'boucle' in title_lower or 'camel' in title_lower:
        col_id = 'col-silver'
        tier = 'Silver'
        hours = 45 + (i * 3) % 20
        fabric = '100% Irish Linen & Super 130s Merino Wool (380 GSM)'
        emb_tech = 'Art Deco Silver Linear Wire & Tonal Resham Needlework'
    else:
        col_id = 'col-essentials'
        tier = 'Essentials'
        hours = 35 + (i * 2) % 15
        fabric = 'Super 120s Tailoring Wool Blend with Bemberg Cupro Facing'
        emb_tech = 'Precision Hand-Guided Marori Cord & Edge Stitching'
        
    # Resolve images
    fallbacks = [
        '/uploads/2026/06/Mens-Premium-Prince-Coat-4.webp',
        '/uploads/2026/06/Burgundy-Blazer-·-Silver-Art-Deco.webp',
        '/uploads/2026/06/Black-Brocade-Tuxedo-Jacket-3.webp',
        '/uploads/2026/06/Black-Wool-Blend-Tailored-Blazer-11.webp',
        '/uploads/2026/06/Ivory-White-Linen-Tailored-Blazer-4.webp',
        '/uploads/2026/06/Black-Blazer-3.webp',
        '/uploads/2026/06/Premium-Taupe-Longline-Embroidered-Tuxedo-Coat-3.webp',
        '/uploads/2026/06/Mens-Navy-Blue-Slim-Suit-Coat-3.webp'
    ]
    
    featured_img = get_best_image_path(p['thumbnail_url'], [fallbacks[i % len(fallbacks)]])
    gallery = []
    for g_url in p['gallery_urls']:
        resolved = get_best_image_path(g_url, [featured_img])
        if resolved not in gallery:
            gallery.append(resolved)
    if not gallery:
        gallery = [featured_img]
        
    desc = p['excerpt'] or p['content'] or f"A bespoke masterpiece handcrafted in our atelier. Features meticulous hand-guided embroidery, floating horsehair canvas construction, and custom tailoring tailored specifically to your dimensions."
    # Clean HTML from desc
    desc = re.sub(r'<[^>]+>', ' ', desc).strip()
    if len(desc) > 280:
        desc = desc[:280] + '...'
    if not desc:
        desc = f"Handcrafted luxury {title.lower()} tailored from {fabric.lower()}. Featuring {emb_tech.lower()}."
        
    products_ts.append({
        'id': f"prod-{p['wp_id']}",
        'slug': slug,
        'title': title,
        'collection_id': col_id,
        'base_price_gbp': price,
        'regular_price_gbp': regular_price,
        'sale_price_gbp': sale_price,
        'description': desc,
        'featured_image_url': featured_img,
        'gallery_images': gallery,
        'stock_status': 'in_stock',
        'stock_quantity': 4 + (i % 7),
        'is_featured': i < 8,
        'lead_time_weeks': 3 if tier in ['Silver', 'Essentials'] else 4 if tier == 'Gold' else 5,
        'tier': tier,
        'acf_meta': {
            'fabric_composition': fabric,
            'embroidery_technique': emb_tech,
            'embroidery_hours': hours,
            'embroidery_placement': ['Collar', 'Lapels', 'Cuffs', 'Chest Pocket', 'Back Yoke'],
            'care_instructions': 'Specialist Dry Clean Only. Store in breathable archival garment bag.',
            'product_colors': [
                {'name': 'Imperial Emerald', 'hex': '#162923'},
                {'name': 'Royal Burgundy', 'hex': '#4A0E17'},
                {'name': 'Midnight Onyx', 'hex': '#0A0A0A'},
            ],
            'product_highlights': [
                {'highlight': f"{hours}+ hours of meticulous hand needlework by master ustads"},
                {'highlight': 'Full floating horsehair canvas for an immaculate drape'},
                {'highlight': 'Complimentary DHL Express worldwide insured shipping'},
                {'highlight': 'Complimentary virtual fitting consultation with master tailors'}
            ]
        },
        'created_at': f"2026-06-{i+1:02d}T00:00:00Z",
        'updated_at': "2026-08-22T00:00:00Z"
    })

print(f"Generated {len(products_ts)} complete product records!")
with open('/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/src/lib/all_products_catalog.json', 'w') as f:
    json.dump(products_ts, f, indent=2)
