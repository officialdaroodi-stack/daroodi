import re
import json

sql_path = '/home/ijtiba-rana/Downloads/localhost.sql'
print("Reading SQL dump...")
with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

print(f"Total SQL size: {len(sql) / 1024 / 1024:.2f} MB")

# Find table names
tables = re.findall(r'CREATE TABLE `?(\w+)`?', sql)
print("Tables found:", [t for t in tables if 'post' in t or 'product' in t or 'term' in t])

# Find all occurrences where post_type is 'product' or 'product_variation'
# In MySQL dumps, INSERT INTO `wp...posts` VALUES (...)
# Let's search line by line or find post blocks
posts_lines = [line for line in sql.splitlines() if 'INSERT INTO' in line and 'posts' in line]
print(f"Found {len(posts_lines)} INSERT INTO posts statements")

# Let's also look for all attachments / image URLs
attachments = {}
# id, guid
att_matches = re.findall(r"\((\d+),\d+,[^,]+,[^,]+,[^,]+,'([^']*)',[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\d+,'([^']*)',\d+,'attachment'", sql)
for m in att_matches:
    attachments[m[0]] = m[2]

print(f"Extracted {len(attachments)} attachments")

# Now let's extract postmeta to get _thumbnail_id, _price, _regular_price, _sale_price, etc.
postmeta = {}
pm_matches = re.findall(r"\((\d+),(\d+),'([^']*)',((?:'(?:[^'\\]|\\.)*')|NULL)\)", sql)
for pm in pm_matches:
    meta_id, post_id, key, val = pm
    if val.startswith("'") and val.endswith("'"):
        val = val[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    if post_id not in postmeta:
        postmeta[post_id] = {}
    postmeta[post_id][key] = val

print(f"Extracted postmeta for {len(postmeta)} posts")

# Let's find all products across all tables
# Format in wp_posts / wp5n_posts
# (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)

# Let's search with regex for any product row in sql:
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
    thumb_url = attachments.get(thumb_id, '')
    price = meta.get('_price') or meta.get('_regular_price') or '950'
    regular_price = meta.get('_regular_price') or price
    sale_price = meta.get('_sale_price') or None
    
    gallery_ids = meta.get('_product_image_gallery', '').split(',')
    gallery_urls = [attachments.get(gid.strip()) for gid in gallery_ids if gid.strip() in attachments]
    
    products.append({
        'id': f"prod-{pid}",
        'wp_id': pid,
        'title': title,
        'slug': slug,
        'status': status,
        'content': content,
        'excerpt': excerpt,
        'price': price,
        'regular_price': regular_price,
        'sale_price': sale_price,
        'thumbnail_id': thumb_id,
        'thumbnail_url': thumb_url,
        'gallery_urls': gallery_urls,
        'meta': {k: v for k, v in meta.items() if not k.startswith('_wp_') and len(str(v)) < 500}
    })

print(f"Total products found: {len(products)}")
for i, p in enumerate(products):
    print(f"{i+1}. [{p['status']}] {p['title']} (slug: {p['slug']}) - Price: {p['price']} - Thumb: {p['thumbnail_url']}")

with open('/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/all_23_products.json', 'w') as f:
    json.dump(products, f, indent=2)
