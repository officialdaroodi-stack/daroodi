# Dashboard Presentation Video

This project includes an automated video presentation script that:

1. **Shows HTML slides** explaining each dashboard section
2. **Navigates through the live admin dashboard** (all pages)
3. **Shows the storefront pages**
4. **Records everything as a video**

## Prerequisites

✅ Already installed:
- Playwright
- Chromium browser

## How to Record the Presentation

### Step 1: Start the development server

Open a terminal and run:

```bash
npm run dev
```

Keep this running. The dev server must be live at `http://localhost:3000`.

### Step 2: Run the setup script (if not done already)

In another terminal:

```bash
npm run db:setup
```

This creates the admin user and seeds data. You only need to do this once.

### Step 3: Record the presentation

In a third terminal:

```bash
npm run record-presentation
```

This will:
- Open a Chrome browser window (you'll see it)
- Show 15 slides explaining the dashboard (90 seconds total)
- Login to the admin dashboard
- Navigate through all 11 admin sections
- Show 7 storefront pages
- Record everything as a video

**Total duration:** ~4-5 minutes

### Step 4: Find the video

After recording completes, look for a file named:
```
video-<timestamp>.webm
```

in the project root directory.

### Step 5 (Optional): Convert to MP4

If you need MP4 format (for wider compatibility), use ffmpeg:

```bash
ffmpeg -i video-*.webm -c:v libx264 -c:a aac dashboard-presentation.mp4
```

## What's Included in the Presentation

### Part 1: Slides (90 seconds)

1. Dashboard Overview
2. Authentication & Access Control
3. Dashboard Metrics
4. Products Management
5. Collections System
6. Orders & Sales
7. Journal (Blog) CMS
8. Dynamic Pages CMS
9. Analytics & Tracking
10. Settings & Integrations
11. User Management
12. Finance & Commissions
13. Storefront Pages
14. Technical Architecture
15. Ready to Go Live

### Part 2: Live Dashboard Walkthrough (2-3 minutes)

- Overview page (revenue, orders, metrics)
- Products page (product list, add/edit)
- Collections page
- Orders page (order list, filters)
- Journal page (blog posts)
- Pages CMS
- Analytics dashboard
- Users page
- Finance page
- My Sales page
- Country Managers page

### Part 3: Storefront Pages (1-2 minutes)

- Homepage (collections, featured products)
- Shop page (product catalog)
- Product detail page
- Journal index
- Journal post detail
- Track Order page
- Contact page

## Customization

You can edit the script at:
```
scripts/record-dashboard-presentation.ts
```

To change:
- Slide duration (increase/decrease `duration` values)
- Dashboard sections to show (add/remove from `sections` array)
- Storefront pages to show (add/remove from `storefrontPages` array)
- Video resolution (change `viewport` width/height)

## Troubleshooting

**"Dashboard not running" error:**
- Make sure `npm run dev` is running in another terminal
- Wait for "Local: http://localhost:3000" message before recording

**Video file not found:**
- Look for `.webm` files in the project root
- The filename includes a timestamp, e.g., `video-1-2026-09-03.webm`

**Browser crashes or hangs:**
- Close all Chrome/Chromium instances
- Re-run `npx playwright install chromium`
- Try again

**"Cannot find admin user" error:**
- Run `npm run db:setup` to create the admin user
- Check that `.env.local` has the correct credentials

## Technical Details

**Script:** `scripts/record-dashboard-presentation.ts`  
**Slides HTML:** Auto-generated at `scripts/presentation-slides.html`  
**Video format:** WebM (VP8 video, Opus audio)  
**Resolution:** 1920x1080 (Full HD)  
**Frame rate:** 25 fps (Playwright default)  
**Browser:** Chromium (headless: false, so you can see it)

## Credits

Built with:
- [Playwright](https://playwright.dev/) - Browser automation
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Database & auth
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Need help?** Check `DASHBOARD_GUIDE.md` for full documentation.
