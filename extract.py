import re
import json

sql_file = '/home/ijtiba-rana/Downloads/localhost.sql'
print('Parsing wp5n_posts and wp5n_postmeta from localhost.sql...')

posts_data = {}
postmeta_data = {}
terms = {}
term_taxonomy = {}
term_relationships = {}

# Simple parser for SQL INSERT statements
def parse_values(line):
    # Strip INSERT INTO ... VALUES
    idx = line.find('VALUES')
    if idx == -1:
        return []
    val_str = line[idx + 6:].strip().rstrip(';')
    # We want to yield each row tuple (val1, val2, ...)
    # Let's use a state machine parser for CSV/SQL tuples
    rows = []
    current_row = []
    current_val = []
    in_string = False
    escape = False
    in_row = False

    for char in val_str:
        if escape:
            current_val.append(char)
            escape = False
            continue

        if char == '\\':
            escape = True
            continue

        if char == "'":
            in_string = not in_string
            continue

        if not in_string:
            if char == '(':
                in_row = True
                current_row = []
                current_val = []
            elif char == ')':
                if in_row:
                    current_row.append(''.join(current_val).strip())
                    rows.append(current_row)
                    in_row = False
                    current_row = []
                    current_val = []
            elif char == ',':
                if in_row:
                    current_row.append(''.join(current_val).strip())
                    current_val = []
            else:
                current_val.append(char)
        else:
            current_val.append(char)

    return rows

with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if 'INSERT INTO `wp5n_posts`' in line:
            rows = parse_values(line)
            for r in rows:
                if len(r) >= 21:
                    pid = r[0]
                    content = r[4]
                    title = r[5]
                    excerpt = r[6]
                    status = r[7]
                    slug = r[11]
                    guid = r[18]
                    post_type = r[20]
                    posts_data[pid] = {
                        'id': pid,
                        'title': title,
                        'slug': slug,
                        'content': content,
                        'excerpt': excerpt,
                        'status': status,
                        'guid': guid,
                        'type': post_type
                    }

        elif 'INSERT INTO `wp5n_postmeta`' in line:
            rows = parse_values(line)
            for r in rows:
                if len(r) >= 4:
                    pid = r[1]
                    key = r[2]
                    val = r[3]
                    if pid not in postmeta_data:
                        postmeta_data[pid] = {}
                    postmeta_data[pid][key] = val

products = [p for p in posts_data.values() if p['type'] == 'product' and p['status'] == 'publish']
posts = [p for p in posts_data.values() if p['type'] == 'post' and p['status'] == 'publish']
attachments = {p['id']: p['guid'] for p in posts_data.values() if p['type'] == 'attachment'}

print(f"\n==========================================")
print(f"Total Published Products Found: {len(products)}")
print(f"Total Published Blog Articles Found: {len(posts)}")
print(f"Total Media Attachments Found: {len(attachments)}")
print(f"==========================================\n")

detailed_products = []
for p in products:
    meta = postmeta_data.get(p['id'], {})
    price = meta.get('_price', meta.get('_regular_price', '950'))
    sale_price = meta.get('_sale_price', '')
    sku = meta.get('_sku', f"DAR-{p['id']}")
    thumb_id = meta.get('_thumbnail_id', '')
    image_url = attachments.get(thumb_id, '')
    gallery_ids = meta.get('_product_image_gallery', '').split(',')
    gallery_urls = [attachments.get(gid.strip(), '') for gid in gallery_ids if gid.strip() in attachments]

    item = {
        'id': p['id'],
        'title': p['title'],
        'slug': p['slug'],
        'price': f"£{price}" if not str(price).startswith('£') else price,
        'sku': sku,
        'image': image_url,
        'gallery': gallery_urls,
        'excerpt': p['excerpt'],
        'content': p['content'],
        'meta': {
            'zardozi_hours': meta.get('zardozi_hours', '120 Hours'),
            'fabric': meta.get('fabric_composition', '520 GSM Micro Velvet & Italian Canvas'),
            'lining': meta.get('lining_material', '100% Pure Bemberg Cupro Silk'),
            'embroidery_technique': meta.get('embroidery_technique', 'Pure Metallic Dabka & Bullion Zardozi Handwork'),
            'fit': meta.get('fit_type', 'Bespoke Tailored / Made-to-Measure')
        }
    }
    detailed_products.append(item)
    print(f"✔ [{item['id']}] {item['title']} | Price: {item['price']} | Image: {item['image'][:60] if item['image'] else 'None'}")

with open('daroodi_master_db.json', 'w', encoding='utf-8') as out:
    json.dump({
        'products': detailed_products,
        'posts': posts
    }, out, indent=2)

print("\nSuccessfully compiled daroodi_master_db.json!")
