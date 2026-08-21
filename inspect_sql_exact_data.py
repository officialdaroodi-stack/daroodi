import re
import json
import os

def parse_sql(sql_file):
    print(f"=== Reading {sql_file} ===")
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        sql = f.read()

    # Parse wp_posts values
    # We can match INSERT INTO `wp5n_posts` or `wp_posts`
    posts = {}
    # Let's find all rows in posts inserts
    insert_posts = re.findall(r"INSERT INTO `?(?:\w+_)?posts`? VALUES\s*(.*?);", sql, re.DOTALL)
    print(f"Found {len(insert_posts)} INSERT statements for posts")
    
    # Extract each tuple
    for block in insert_posts:
        # Match each tuple
        tuples = re.finditer(r"\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*((?:'(?:[^'\\]|\\.)*')|''),\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*'([^']*)',\s*(\d+),\s*'([^']*)'", block)
        for t in tuples:
            pid = t.group(1)
            pauthor = t.group(2)
            pdate = t.group(3)
            pcontent = t.group(5)
            ptitle = t.group(6).replace("\\'", "'").replace('\\"', '"')
            pexcerpt = t.group(7).replace("\\'", "'").replace('\\"', '"')
            pstatus = t.group(8)
            pslug = t.group(12).replace("\\'", "'").replace('\\"', '"')
            pparent = t.group(18)
            pguid = t.group(19).replace('\\/', '/')
            ptype = t.group(21)
            posts[pid] = {
                'id': pid,
                'author': pauthor,
                'date': pdate,
                'content': pcontent,
                'title': ptitle,
                'excerpt': pexcerpt,
                'status': pstatus,
                'slug': pslug,
                'parent': pparent,
                'guid': pguid,
                'type': ptype
            }

    print(f"Total posts parsed: {len(posts)}")
    attachments = {k: v for k, v in posts.items() if v['type'] == 'attachment'}
    products = {k: v for k, v in posts.items() if v['type'] == 'product'}
    print(f"Attachments: {len(attachments)}, Products: {len(products)}")

    # Parse postmeta
    meta = {}
    insert_meta = re.findall(r"INSERT INTO `?(?:\w+_)?postmeta`? VALUES\s*(.*?);", sql, re.DOTALL)
    for block in insert_meta:
        tuples = re.finditer(r"\((\d+),\s*(\d+),\s*'((?:[^'\\]|\\.)*)',\s*((?:'(?:[^'\\]|\\.)*')|NULL)\)", block)
        for t in tuples:
            mid = t.group(1)
            pid = t.group(2)
            k = t.group(3).replace("\\'", "'")
            v = t.group(4)
            if v and v.startswith("'") and v.endswith("'"):
                v = v[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
            if pid not in meta:
                meta[pid] = {}
            meta[pid][k] = v

    print(f"Total meta parsed for {len(meta)} posts")

    # Let's inspect each product
    product_details = []
    for pid, p in products.items():
        pm = meta.get(pid, {})
        thumb_id = pm.get('_thumbnail_id')
        thumb_att = attachments.get(thumb_id, {})
        
        # Attached file of the attachment post
        thumb_file = meta.get(thumb_id, {}).get('_wp_attached_file') if thumb_id else None
        
        # Gallery
        gallery_ids = pm.get('_product_image_gallery', '')
        gallery_list = [gid.strip() for gid in gallery_ids.split(',') if gid.strip()]
        gallery_files = []
        for gid in gallery_list:
            gatt = attachments.get(gid, {})
            gfile = meta.get(gid, {}).get('_wp_attached_file')
            gallery_files.append({
                'id': gid,
                'guid': gatt.get('guid'),
                'file': gfile
            })
            
        # Parent attachments
        child_attachments = [att for att in attachments.values() if att['parent'] == pid]
        
        product_details.append({
            'id': pid,
            'title': p['title'],
            'slug': p['slug'],
            'status': p['status'],
            'price': pm.get('_price'),
            'regular_price': pm.get('_regular_price'),
            'sale_price': pm.get('_sale_price'),
            'sku': pm.get('_sku'),
            'thumb_id': thumb_id,
            'thumb_guid': thumb_att.get('guid'),
            'thumb_file': thumb_file,
            'gallery_files': gallery_files,
            'child_attachments': [{'id': ca['id'], 'guid': ca['guid'], 'file': meta.get(ca['id'], {}).get('_wp_attached_file')} for ca in child_attachments],
            'meta_keys': list(pm.keys())
        })

    return product_details, attachments, meta

p_local, att_local, meta_local = parse_sql('/home/ijtiba-rana/Downloads/localhost.sql')
print(f"\n=======================================================")
print(f"DETAILS FOR ALL {len(p_local)} PRODUCTS IN LOCALHOST.SQL:")
print(f"=======================================================")
for i, p in enumerate(p_local):
    print(f"\n{i+1:2d}. [ID: {p['id']}] {p['title']}")
    print(f"    Slug: {p['slug']} | Price: £{p['price']} | Status: {p['status']}")
    print(f"    Featured Image (Thumb ID {p['thumb_id']}):")
    print(f"      - GUID: {p['thumb_guid']}")
    print(f"      - Attached File: {p['thumb_file']}")
    print(f"    Gallery ({len(p['gallery_files'])}): {[g['file'] or g['guid'] for g in p['gallery_files']]}")
    print(f"    Child Attachments ({len(p['child_attachments'])}): {[ca['file'] or ca['guid'] for ca in p['child_attachments']]}")

with open('exact_sql_parsed_products.json', 'w') as f:
    json.dump(p_local, f, indent=2)

print("\nSaved exact parsed products to exact_sql_parsed_products.json")
