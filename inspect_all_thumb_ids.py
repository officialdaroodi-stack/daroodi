import re
import json
import os

sql_file = '/home/ijtiba-rana/Downloads/localhost.sql'
with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Find all posts in wp5n_posts
posts = {}
# Find all (ID, ..., 'attachment') or 'product'
for m in re.finditer(r"\((\d+),\s*(\d+),\s*'[^']*',\s*'[^']*',\s*(?:'(?:[^'\\]|\\.)*'|''),\s*'((?:[^'\\]|\\.)*)',\s*'(?:[^'\\]|\\.)*',\s*'([^']*)',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'((?:[^'\\]|\\.)*)',\s*[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*(\d+),\s*'((?:[^'\\]|\\.)*)',\s*\d+,\s*'([^']*)'", sql):
    pid = m.group(1)
    title = m.group(3).replace("\\'", "'")
    status = m.group(4)
    slug = m.group(5).replace("\\'", "'")
    parent = m.group(6)
    guid = m.group(7).replace('\\/', '/').replace("\\'", "'")
    ptype = m.group(8)
    posts[pid] = {
        'id': pid,
        'title': title,
        'status': status,
        'slug': slug,
        'parent': parent,
        'guid': guid,
        'type': ptype
    }

print(f"Parsed {len(posts)} posts (Products: {sum(1 for p in posts.values() if p['type'] == 'product')}, Attachments: {sum(1 for p in posts.values() if p['type'] == 'attachment')})")

# Parse postmeta
meta = {}
for m in re.finditer(r"\((\d+),\s*(\d+),\s*'((?:[^'\\]|\\.)*)',\s*((?:'(?:[^'\\]|\\.)*')|NULL)\)", sql):
    pid = m.group(2)
    k = m.group(3).replace("\\'", "'")
    v = m.group(4)
    if v and v.startswith("'") and v.endswith("'"):
        v = v[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    if pid not in meta:
        meta[pid] = {}
    meta[pid][k] = v

print(f"Parsed meta for {len(meta)} posts")

products = [p for p in posts.values() if p['type'] == 'product']
products.sort(key=lambda x: int(x['id']))

local_06 = set(os.listdir('public/uploads/2026/06'))
local_05 = set(os.listdir('public/uploads/2026/05'))

print("\n=======================================================")
print("EXACT WP PRODUCT THUMBNAILS & ATTACHED FILES:")
print("=======================================================")

result = []
for p in products:
    pid = p['id']
    pm = meta.get(pid, {})
    thumb_id = pm.get('_thumbnail_id')
    thumb_post = posts.get(thumb_id, {})
    thumb_file = meta.get(thumb_id, {}).get('_wp_attached_file')
    gallery_raw = pm.get('_product_image_gallery', '')
    gallery_ids = [gid.strip() for gid in gallery_raw.split(',') if gid.strip()]
    
    print(f"\nProduct [{pid}] {p['title']}")
    print(f"  Slug: {p['slug']} | Price: £{pm.get('_price')}")
    print(f"  Thumb ID: {thumb_id}")
    print(f"  Thumb Title: {thumb_post.get('title')}")
    print(f"  Thumb GUID: {thumb_post.get('guid')}")
    print(f"  Thumb File: {thumb_file}")
    print(f"  Gallery IDs ({len(gallery_ids)}): {gallery_ids}")
    for gid in gallery_ids:
        gp = posts.get(gid, {})
        gf = meta.get(gid, {}).get('_wp_attached_file')
        print(f"    - [{gid}] {gp.get('title')} -> GUID: {gp.get('guid')} | File: {gf}")

    result.append({
        'pid': pid,
        'title': p['title'],
        'slug': p['slug'],
        'price': pm.get('_price') or pm.get('_regular_price') or '800',
        'regular_price': pm.get('_regular_price') or pm.get('_price') or '800',
        'sale_price': pm.get('_sale_price'),
        'thumb_id': thumb_id,
        'thumb_title': thumb_post.get('title'),
        'thumb_guid': thumb_post.get('guid'),
        'thumb_file': thumb_file,
        'gallery': [{'id': gid, 'title': posts.get(gid, {}).get('title'), 'guid': posts.get(gid, {}).get('guid'), 'file': meta.get(gid, {}).get('_wp_attached_file')} for gid in gallery_ids]
    })

with open('all_23_raw_wp_meta.json', 'w') as f:
    json.dump(result, f, indent=2)

print("\nSaved raw meta to all_23_raw_wp_meta.json")
