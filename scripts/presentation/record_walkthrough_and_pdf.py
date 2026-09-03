import asyncio
import os
import glob
import subprocess
from playwright.async_api import async_playwright
from presentation_slides import SLIDES, generate_slide_html

BASE_DIR = "/home/ijtiba-rana/Desktop/daroodi (2)/daroodi-app/scripts/presentation"
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
VIDEO_RAW_DIR = os.path.join(BASE_DIR, "raw_video")
HTML_SLIDES_DIR = os.path.join(BASE_DIR, "html_slides")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(VIDEO_RAW_DIR, exist_ok=True)
os.makedirs(HTML_SLIDES_DIR, exist_ok=True)

# Generate HTML slide files
slide_files = {}
total_slides = len(SLIDES)
for idx, slide in enumerate(SLIDES, start=1):
    html_content = generate_slide_html(slide, idx, total_slides)
    file_path = os.path.join(HTML_SLIDES_DIR, f"slide_{slide['tab_id']}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    slide_files[slide['tab_id']] = f"file://{file_path}"

async def run_presentation():
    print("=== Starting Daroodi Presentation Video & Screenshots Capture ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path='/usr/bin/google-chrome',
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        
        # Create context with video recording at 1920x1080
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            record_video_dir=VIDEO_RAW_DIR,
            record_video_size={'width': 1920, 'height': 1080}
        )
        
        page = await context.new_page()
        page.set_default_timeout(30000)

        # -------------------------------------------------------------
        # STEP 1: Intro Slide
        # -------------------------------------------------------------
        print("1. Showing Title Intro Slide...")
        await page.goto(slide_files['intro'])
        await page.wait_for_timeout(4500)

        # -------------------------------------------------------------
        # STEP 2: Live Storefront Demo
        # -------------------------------------------------------------
        print("2. Showing Storefront Overview Slide...")
        await page.goto(slide_files['storefront'])
        await page.wait_for_timeout(3500)

        print("2b. Navigating Live Storefront (daroodi.com)...")
        await page.goto('https://www.daroodi.com', wait_until='networkidle')
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '01_storefront_home.png'), full_page=False)
        await page.wait_for_timeout(2000)
        # Scroll down home
        await page.evaluate('window.scrollBy({ top: 800, behavior: "smooth" })')
        await page.wait_for_timeout(2000)
        await page.evaluate('window.scrollBy({ top: 1200, behavior: "smooth" })')
        await page.wait_for_timeout(2500)

        # Visit Shop
        print("2c. Navigating Live Shop...")
        await page.goto('https://www.daroodi.com/shop', wait_until='networkidle')
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '02_storefront_shop.png'), full_page=False)
        await page.wait_for_timeout(2000)
        await page.evaluate('window.scrollBy({ top: 700, behavior: "smooth" })')
        await page.wait_for_timeout(2500)

        # -------------------------------------------------------------
        # STEP 3: Authentication & Passwords
        # -------------------------------------------------------------
        print("3. Showing Authentication Slide with Passwords...")
        await page.goto(slide_files['auth'])
        await page.wait_for_timeout(4000)

        print("3b. Performing Live Super Admin Login on daroodi.com...")
        await page.goto('https://www.daroodi.com/auth/login', wait_until='networkidle')
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '03_auth_login_page.png'), full_page=False)
        await page.wait_for_timeout(1500)

        # Fill credentials with human-like typing
        await page.fill('input[type="email"]', 'admin@daroodi.com')
        await page.wait_for_timeout(500)
        await page.fill('input[type="password"]', 'DaroodiMasterAdmin2026!#')
        await page.wait_for_timeout(800)
        await page.click('button[type="submit"]')

        # Wait for navigation to /admin
        try:
            await page.wait_for_url('**/admin**', timeout=15000)
            await page.wait_for_load_state('networkidle')
            print("Successfully reached live Admin Dashboard:", page.url)
        except Exception as e:
            print("Notice on admin navigation:", e)
            await page.goto('https://www.daroodi.com/admin', wait_until='networkidle')

        await page.wait_for_timeout(2500)

        # -------------------------------------------------------------
        # STEP 4: Tab 1 - Overview & KPIs
        # -------------------------------------------------------------
        print("4. Tab 1: Overview & KPIs Slide...")
        await page.goto(slide_files['overview'])
        await page.wait_for_timeout(3500)

        print("4b. Live Overview Dashboard...")
        await page.goto('https://www.daroodi.com/admin', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '04_admin_overview.png'), full_page=False)
        await page.evaluate('window.scrollBy({ top: 500, behavior: "smooth" })')
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 5: Tab 2 - User Hierarchy & Roles
        # -------------------------------------------------------------
        print("5. Tab 2: User Hierarchy & Roles Slide...")
        await page.goto(slide_files['users'])
        await page.wait_for_timeout(3500)

        print("5b. Live User Hierarchy...")
        await page.goto('https://www.daroodi.com/admin/users', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '05_admin_users.png'), full_page=False)
        await page.evaluate('window.scrollBy({ top: 400, behavior: "smooth" })')
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 6: Tab 3 - Products & ACF Specs + Image Upload Gallery
        # -------------------------------------------------------------
        print("6. Tab 3: Products & ACF Specs Slide...")
        await page.goto(slide_files['products'])
        await page.wait_for_timeout(3500)

        print("6b. Live Products Catalog...")
        await page.goto('https://www.daroodi.com/admin/products', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '06_admin_products_catalog.png'), full_page=False)
        
        # Click "+ Create Masterpiece" to open Product Editor modal
        try:
            create_btn = page.locator('button:has-text("Create Masterpiece"), button:has-text("Add Product")').first
            if await create_btn.is_visible():
                await create_btn.click()
                await page.wait_for_timeout(1500)
                # Switch to Tab 4 "Media & Gallery" to showcase upload buttons
                media_tab = page.locator('button:has-text("Media"), button:has-text("Gallery")').first
                if await media_tab.is_visible():
                    await media_tab.click()
                    await page.wait_for_timeout(1500)
                    await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '06b_admin_product_editor_gallery_upload.png'), full_page=False)
                    await page.wait_for_timeout(2000)
                # Close modal
                close_btn = page.locator('button:has-text("Cancel")').first
                if await close_btn.is_visible():
                    await close_btn.click()
        except Exception as err:
            print("Modal interaction note:", err)

        await page.wait_for_timeout(1500)

        # -------------------------------------------------------------
        # STEP 7: Tab 4 - Orders & Measurements
        # -------------------------------------------------------------
        print("7. Tab 4: Orders & Measurements Slide...")
        await page.goto(slide_files['orders'])
        await page.wait_for_timeout(3500)

        print("7b. Live Orders & Measurements...")
        await page.goto('https://www.daroodi.com/admin/orders', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '07_admin_orders.png'), full_page=False)
        await page.evaluate('window.scrollBy({ top: 400, behavior: "smooth" })')
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 8: Tab 5 - Revenue & Financial Analytics
        # -------------------------------------------------------------
        print("8. Tab 5: Revenue & Financial Analytics Slide...")
        await page.goto(slide_files['finance'])
        await page.wait_for_timeout(3500)

        print("8b. Live Revenue Analytics...")
        await page.goto('https://www.daroodi.com/admin/finance', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '08_admin_finance.png'), full_page=False)
        await page.evaluate('window.scrollBy({ top: 400, behavior: "smooth" })')
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 9: Tab 6 - Commission Approvals & Payouts
        # -------------------------------------------------------------
        print("9. Tab 6: Commission Approvals Slide...")
        await page.goto(slide_files['payouts'])
        await page.wait_for_timeout(3500)

        print("9b. Live Commission Payouts...")
        await page.goto('https://www.daroodi.com/admin/finance/payouts', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '09_admin_payouts.png'), full_page=False)
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 10: Tab 7 - Global Marketing Campaigns
        # -------------------------------------------------------------
        print("10. Tab 7: Marketing Campaigns Slide...")
        await page.goto(slide_files['marketing'])
        await page.wait_for_timeout(3500)

        print("10b. Live Marketing Campaigns...")
        await page.goto('https://www.daroodi.com/admin/marketing', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '10_admin_marketing.png'), full_page=False)
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 11: Tab 8 - Country Heads & Regional Agents
        # -------------------------------------------------------------
        print("11. Tab 8: Country Heads & Regional Agents Slide...")
        await page.goto(slide_files['country_managers'])
        await page.wait_for_timeout(3500)

        print("11b. Live Country Managers...")
        await page.goto('https://www.daroodi.com/admin/marketing/country-managers', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '11_admin_country_managers.png'), full_page=False)
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 12: Tab 9 - Editorial Journal CMS
        # -------------------------------------------------------------
        print("12. Tab 9: Blog Posts & Editorial Slide...")
        await page.goto(slide_files['posts'])
        await page.wait_for_timeout(3500)

        print("12b. Live Blog Posts CMS...")
        await page.goto('https://www.daroodi.com/admin/posts', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '12_admin_posts.png'), full_page=False)
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 13: Tab 10 - Storefront Pages CMS
        # -------------------------------------------------------------
        print("13. Tab 10: Storefront Pages Slide...")
        await page.goto(slide_files['pages'])
        await page.wait_for_timeout(3500)

        print("13b. Live Storefront Pages CMS...")
        await page.goto('https://www.daroodi.com/admin/pages', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '13_admin_pages.png'), full_page=False)
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 14: Tab 11 - Customer Reviews & Q&A
        # -------------------------------------------------------------
        print("14. Tab 11: Reviews & Q&A Slide...")
        await page.goto(slide_files['cms'])
        await page.wait_for_timeout(3500)

        print("14b. Live Reviews & Q&A...")
        await page.goto('https://www.daroodi.com/admin/cms', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '14_admin_reviews_qna.png'), full_page=False)
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 15: Tab 12 - Visitor Analytics
        # -------------------------------------------------------------
        print("15. Tab 12: Visitor Analytics Slide...")
        await page.goto(slide_files['analytics'])
        await page.wait_for_timeout(3500)

        print("15b. Live Visitor Analytics...")
        await page.goto('https://www.daroodi.com/admin/analytics', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '15_admin_visitor_analytics.png'), full_page=False)
        await page.evaluate('window.scrollBy({ top: 400, behavior: "smooth" })')
        await page.wait_for_timeout(2000)

        # -------------------------------------------------------------
        # STEP 16: Tab 13 - Tracking & Integrations (Settings)
        # -------------------------------------------------------------
        print("16. Tab 13: Tracking & Integrations Slide...")
        await page.goto(slide_files['settings'])
        await page.wait_for_timeout(3500)

        print("16b. Live Tracking & Integrations...")
        await page.goto('https://www.daroodi.com/admin/settings', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '16_admin_settings_tracking.png'), full_page=False)
        await page.evaluate('window.scrollBy({ top: 500, behavior: "smooth" })')
        await page.wait_for_timeout(2500)

        # -------------------------------------------------------------
        # STEP 17: Summary Slide with Master Credentials Vault
        # -------------------------------------------------------------
        print("17. Summary & Passwords Slide...")
        await page.goto(slide_files['summary'])
        await page.wait_for_timeout(5000)

        print("Closing browser context to finalize video...")
        await page.close()
        await context.close()
        await browser.close()
        print("Presentation video recorded successfully!")

if __name__ == "__main__":
    asyncio.run(run_presentation())
