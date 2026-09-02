import { AnalyticsEvent } from '@/lib/types';

const EVENTS_STORAGE_KEY = 'daroodi_analytics_events';
const VISITOR_KEY = 'daroodi_visitor_id';
const SESSION_KEY = 'daroodi_session_id';
const SESSION_TS_KEY = 'daroodi_session_ts';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min inactivity = new session
const MAX_STORED_EVENTS = 5000; // cap localStorage growth

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: any;
  }
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const now = Date.now();
  const lastTs = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0);
  let id = sessionStorage.getItem(SESSION_KEY);

  if (!id || now - lastTs > SESSION_TIMEOUT_MS) {
    id = uuid();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  sessionStorage.setItem(SESSION_TS_KEY, String(now));
  return id;
}

function detectDevice(): AnalyticsEvent['device'] {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Other';
}

function readEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistEvent(event: AnalyticsEvent) {
  const events = readEvents();
  events.push(event);
  // Keep only the most recent MAX_STORED_EVENTS
  const trimmed = events.length > MAX_STORED_EVENTS ? events.slice(-MAX_STORED_EVENTS) : events;
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Quota exceeded — drop oldest half and retry once
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(trimmed.slice(-2500)));
    } catch {
      // give up silently
    }
  }
}

/**
 * Push to third-party pixels if their scripts are installed via /admin/settings.
 * Safe no-ops when the integrations aren't configured.
 */
function forwardToPixels(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  // Google Tag Manager dataLayer
  if (Array.isArray(window.dataLayer)) {
    const { id, session_id, visitor_id, ...rest } = event;
    window.dataLayer.push({ ...rest });
  }

  // GA4 direct (gtag)
  if (typeof window.gtag === 'function' && event.event !== 'page_view') {
    window.gtag('event', event.event, {
      value: event.value,
      currency: event.currency,
      ...event.metadata,
    });
  }

  // Meta Pixel — map standard ecommerce events
  if (typeof window.fbq === 'function') {
    const metaMap: Record<string, string> = {
      page_view: 'PageView',
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      contact: 'Contact',
    };
    const metaEvent = metaMap[event.event];
    if (metaEvent) {
      window.fbq('track', metaEvent, {
        value: event.value,
        currency: event.currency || 'GBP',
        ...event.metadata,
      });
    }
  }

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    const ttMap: Record<string, string> = {
      page_view: 'Browse',
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'CompletePayment',
      contact: 'Contact',
    };
    const ttEvent = ttMap[event.event];
    if (ttEvent) {
      window.ttq.track(ttEvent, {
        value: event.value,
        currency: event.currency || 'GBP',
        ...event.metadata,
      });
    }
  }
}

/**
 * Track an analytics event: stores it in the first-party event log
 * (visible in /admin/analytics) and forwards it to any installed pixels.
 */
export function trackEvent(
  event: string,
  options: {
    value?: number;
    currency?: string;
    metadata?: Record<string, any>;
  } = {}
) {
  if (typeof window === 'undefined') return;

  const record: AnalyticsEvent = {
    id: uuid(),
    event,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    visitor_id: getVisitorId(),
    device: detectDevice(),
    browser: detectBrowser(),
    value: options.value,
    currency: options.currency,
    metadata: options.metadata,
    created_at: new Date().toISOString(),
  };

  persistEvent(record);
  forwardToPixels(record);
}

export function trackPageView(path?: string) {
  if (typeof window === 'undefined') return;
  const record: AnalyticsEvent = {
    id: uuid(),
    event: 'page_view',
    path: path || window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    visitor_id: getVisitorId(),
    device: detectDevice(),
    browser: detectBrowser(),
    created_at: new Date().toISOString(),
  };
  persistEvent(record);

  // GTM / GA4 page_view
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'page_view', page_path: record.path });
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: record.path });
  }
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('Browse');
  }
}

// ─── Admin dashboard readers ────────────────────────────────────────────────

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return readEvents();
}

export function clearAnalyticsEvents() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  }
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  uniqueSessions: number;
  totalEvents: number;
  addToCarts: number;
  checkouts: number;
  purchases: number;
  revenue: number;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ source: string; visits: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  viewsByDay: Array<{ date: string; views: number; visitors: number }>;
  recentEvents: AnalyticsEvent[];
}

export function getAnalyticsSummary(days = 30): AnalyticsSummary {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const events = readEvents().filter((e) => new Date(e.created_at).getTime() >= cutoff);
  const pageViews = events.filter((e) => e.event === 'page_view');

  const visitors = new Set(events.map((e) => e.visitor_id));
  const sessions = new Set(events.map((e) => e.session_id));
  const purchases = events.filter((e) => e.event === 'purchase');

  // Top pages
  const pageCounts = new Map<string, number>();
  pageViews.forEach((e) => {
    const path = e.path.split('?')[0];
    pageCounts.set(path, (pageCounts.get(path) || 0) + 1);
  });
  const topPages = Array.from(pageCounts.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Referrers
  const refCounts = new Map<string, number>();
  pageViews.forEach((e) => {
    let source = 'Direct';
    if (e.referrer) {
      try {
        source = new URL(e.referrer).hostname.replace(/^www\./, '');
      } catch {
        source = e.referrer;
      }
    }
    refCounts.set(source, (refCounts.get(source) || 0) + 1);
  });
  const topReferrers = Array.from(refCounts.entries())
    .map(([source, visits]) => ({ source, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 8);

  // Devices & browsers
  const devCounts = new Map<string, number>();
  const brwCounts = new Map<string, number>();
  events.forEach((e) => {
    devCounts.set(e.device, (devCounts.get(e.device) || 0) + 1);
    if (e.browser) brwCounts.set(e.browser, (brwCounts.get(e.browser) || 0) + 1);
  });

  // Views by day (last N days)
  const dayMap = new Map<string, { views: number; visitors: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayMap.set(d.toISOString().slice(0, 10), { views: 0, visitors: new Set() });
  }
  pageViews.forEach((e) => {
    const day = e.created_at.slice(0, 10);
    const bucket = dayMap.get(day);
    if (bucket) {
      bucket.views += 1;
      bucket.visitors.add(e.visitor_id);
    }
  });
  const viewsByDay = Array.from(dayMap.entries()).map(([date, v]) => ({
    date,
    views: v.views,
    visitors: v.visitors.size,
  }));

  return {
    totalPageViews: pageViews.length,
    uniqueVisitors: visitors.size,
    uniqueSessions: sessions.size,
    totalEvents: events.length,
    addToCarts: events.filter((e) => e.event === 'add_to_cart').length,
    checkouts: events.filter((e) => e.event === 'begin_checkout').length,
    purchases: purchases.length,
    revenue: purchases.reduce((sum, e) => sum + (e.value || 0), 0),
    topPages,
    topReferrers,
    deviceBreakdown: Array.from(devCounts.entries()).map(([device, count]) => ({ device, count })),
    browserBreakdown: Array.from(brwCounts.entries())
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count),
    viewsByDay,
    recentEvents: events.slice(-50).reverse(),
  };
}
