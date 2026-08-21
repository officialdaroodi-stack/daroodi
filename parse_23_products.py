import re
import json

sql_path = '/home/ijtiba-rana/Downloads/localhost.sql'
print("Reading SQL dump for complete meta & attachment mapping...")
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Parse wp5n_posts attachments
# (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
attachments = {}
for m in re.finditer(r"\((\d+),\s*\d+,\s*'[^']*',\s*'[^']*',\s*'(?:[^'\\]|\\.)*',\s*'(?:[^'\\]|\\.)*',\s*'(?:[^'\\]|\\.)*',\s*'inherit',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'([^']*)',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*(\d+),\s*'([^']*)',\s*\d+,\s*'attachment'", sql):
    att_id = m.group(1)
    att_slug = m.group(2)
    att_parent = m.group(3)
    att_guid = m.group(4)
    # clean guid
    clean_guid = att_guid.replace('\\/', '/')
    attachments[att_id] = {
        'id': att_id,
        'slug': att_slug,
        'parent': att_parent,
        'guid': clean_guid
    }

print(f"Extracted {len(attachments)} attachments from wp5n_posts")

# Parse wp5n_postmeta
postmeta = {}
for m in re.finditer(r"\((\d+),\s*(\d+),\s*'((?:[^'\\]|\\.)*)',\s*((?:'(?:[^'\\]|\\.)*')|NULL)\)", sql):
    meta_id = m.group(1)
    post_id = m.group(2)
    meta_key = m.group(3).replace("\\'", "'")
    meta_value = m.group(4)
    if meta_value and meta_value.startswith("'") and meta_value.endswith("'"):
        meta_value = meta_value[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    
    if post_id not in postmeta:
        postmeta[post_id] = {}
    postmeta[post_id][meta_key] = meta_value

print(f"Extracted meta for {len(postmeta)} posts")

# Extract the 23 products
product_pattern = re.compile(r"\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*((?:'(?:[^'\\]|\\.)*')|''),\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*'([^']*)',\s*(\d+),\s*'product'", re.DOTALL)

products = []
for m in product_pattern.finditer(sql):
    pid = m.group(1)
    title = m.group(6).replace("\\'", "'").replace('\\"', '"')
    slug = m.group(12).replace("\\'", "'").replace('\\"', '"')
    content = m.group(5)
    if content.startswith("'") and content.endswith("'"):
        content = content[1:-1].replace("\\'", "'").replace('\\"', '"')
    excerpt = m.group(7).replace("\\'", "'").replace('\\"', '"')
    status = m.group(8)
    
    meta = postmeta.get(pid, {})
    thumb_id = meta.get('_thumbnail_id')
    thumb_att = attachments.get(thumb_id, {})
    thumb_guid = thumb_att.get('guid', '')
    
    price = meta.get('_price') or meta.get('_regular_price') or '950'
    regular_price = meta.get('_regular_price') or price
    sale_price = meta.get('_sale_price') or None
    
    gallery_raw = meta.get('_product_image_gallery', '')
    gallery_ids = [gid.strip() for gid in gallery_raw.split(',') if gid.strip()]
    gallery_guids = [attachments[gid]['guid'] for gid in gallery_ids if gid in attachments]
    
    # Also find all attachments that have post_parent = pid
    parent_attachments = [att['guid'] for att in attachments.values() if att['parent'] == pid]
    
    all_images = []
    if thumb_guid:
        all_images.append(thumb_guid)
    for g in gallery_guids:
        if g not in all_images:
            all_images.append(g)
    for pa in parent_attachments:
        if pa not in all_images:
            all_images.append(pa)
            
    products.append({
        'id': f"prod-{pid}",
        'wp_id': pid,
        'title': title,
        'slug': slug,
        'status': status,
        'content': content,
        'excerpt': excerpt,
        'price': float(price) if price else 950.0,
        'regular_price': float(regular_price) if regular_price else 950.0,
        'sale_price': float(sale_price) if sale_price else None,
        'thumbnail_id': thumb_id,
        'thumbnail_url': thumb_guid,
        'gallery_urls': all_images,
        'meta': {k: v for k, v in meta.items() if not k.startswith('_wp_') and len(str(v)) < 300}
    })

print(f"\n======================================")
print(f"EXTRACTED {len(products)} AUTHENTIC PRODUCTS:")
print(f"======================================")
for i, p in enumerate(products):
    print(f"{i+1:2d}. ID: {p['wp_id']:4s} | {p['title']:<55s} | Price: £{p['price']:<6.2f} | Images: {len(p['gallery_urls'])}")
    if p['thumbnail_url']:
        print(f"    Thumb: {p['thumbnail_url']}")

with open('/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/exact_23_products_with_meta.json', 'w') as f:
    json.dump(products, f, indent=2)
