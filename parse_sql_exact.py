import re
import json

sql_file = '/home/ijtiba-rana/Downloads/localhost.sql'

print("Extracting all posts and postmeta from localhost.sql...")

# Extract all (ID, post_author, post_date, ...) from wp5n_posts
products = []
posts = []
pages = []

with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    sql_text = f.read()

# Find INSERT INTO `wp5n_posts` block
post_matches = re.finditer(r"\('?(\d+)'?,\s*'?(\d+)'?,\s*'([^']*)',\s*'([^']*)',\s*'(.*?)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'(.*?)',\s*'?(\d+)'?,\s*'([^']*)',\s*'?(\d+)'?,\s*'([^']*)'", sql_text, re.DOTALL)

count = 0
for m in post_matches:
    pid = m.group(1)
    content = m.group(5)
    title = m.group(6)
    excerpt = m.group(7)
    status = m.group(8)
    slug = m.group(12)
    guid = m.group(19)
    post_type = m.group(21)
    count += 1
    if status == 'publish':
        if post_type == 'product':
            products.append({'id': pid, 'title': title, 'slug': slug, 'excerpt': excerpt, 'content': content})
        elif post_type == 'post':
            posts.append({'id': pid, 'title': title, 'slug': slug, 'excerpt': excerpt, 'content': content})
        elif post_type == 'page':
            pages.append({'id': pid, 'title': title, 'slug': slug})

print(f"Total matched: {count}")
print(f"Products: {len(products)}")
print(f"Posts: {len(posts)}")
print(f"Pages: {len(pages)}")

for p in products:
    print(f"Product: {p['title']} ({p['slug']})")

for b in posts[:10]:
    print(f"Blog: {b['title']} ({b['slug']})")
