'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getTrackingSettingsSync } from '@/lib/db/settings';
import { trackPageView } from '@/lib/analytics';
import { TrackingSettings } from '@/lib/types';

const INJECTED_ATTR = 'data-daroodi-tracking';

function removeInjected() {
  document
    .querySelectorAll(`[${INJECTED_ATTR}]`)
    .forEach((el) => el.parentNode?.removeChild(el));
}

function appendScript(parent: HTMLElement, options: { src?: string; content?: string; id?: string }) {
  const el = document.createElement('script');
  el.setAttribute(INJECTED_ATTR, 'true');
  if (options.src) {
    el.src = options.src;
    el.async = true;
  }
  if (options.id) el.id = options.id;
  if (options.content) el.text = options.content;
  parent.appendChild(el);
}

function injectTracking(settings: TrackingSettings) {
  removeInjected();

  // ─── Google Tag Manager (takes priority for GA if both are set) ───
  if (settings.gtm_container_id) {
    const gtmId = settings.gtm_container_id.trim();
    appendScript(document.head, {
      content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
    });
    const noscript = document.createElement('noscript');
    noscript.setAttribute(INJECTED_ATTR, 'true');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.prepend(noscript);
  }

  // ─── GA4 direct (only when GTM is NOT used to avoid double counting) ───
  if (settings.ga4_measurement_id && !settings.gtm_container_id) {
    const gaId = settings.ga4_measurement_id.trim();
    appendScript(document.head, {
      src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
    });
    appendScript(document.head, {
      content: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`,
    });
  }

  // ─── Meta (Facebook) Pixel ───
  if (settings.meta_pixel_id) {
    const fbId = settings.meta_pixel_id.trim();
    appendScript(document.head, {
      content: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbId}');fbq('track','PageView');`,
    });
  }

  // ─── TikTok Pixel ───
  if (settings.tiktok_pixel_id) {
    const ttId = settings.tiktok_pixel_id.trim();
    appendScript(document.head, {
      content: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${ttId}');ttq.page();}(window,document,'ttq');`,
    });
  }

  // ─── Custom raw scripts from the admin settings page ───
  if (settings.custom_head_scripts?.trim()) {
    const tpl = document.createElement('template');
    tpl.innerHTML = settings.custom_head_scripts;
    Array.from(tpl.content.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const s = node as HTMLScriptElement;
        appendScript(document.head, { src: s.src || undefined, content: s.src ? undefined : s.textContent || '' });
      } else {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.setAttribute?.(INJECTED_ATTR, 'true');
        document.head.appendChild(clone);
      }
    });
  }
  if (settings.custom_body_scripts?.trim()) {
    const tpl = document.createElement('template');
    tpl.innerHTML = settings.custom_body_scripts;
    Array.from(tpl.content.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const s = node as HTMLScriptElement;
        appendScript(document.body, { src: s.src || undefined, content: s.src ? undefined : s.textContent || '' });
      } else {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.setAttribute?.(INJECTED_ATTR, 'true');
        document.body.appendChild(clone);
      }
    });
  }
}

/**
 * Installs tracking integrations (GA4 / GTM / Meta / TikTok / custom code)
 * configured from /admin/settings, and records a first-party page_view
 * on every client-side navigation.
 */
export function TrackingScripts() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  // Inject scripts once (and re-inject when settings change)
  useEffect(() => {
    const settings = getTrackingSettingsSync();
    if (settings) injectTracking(settings);

    const onSettingsUpdated = () => {
      const next = getTrackingSettingsSync();
      if (next) injectTracking(next);
    };
    window.addEventListener('daroodi:settings-updated', onSettingsUpdated);
    return () => {
      window.removeEventListener('daroodi:settings-updated', onSettingsUpdated);
    };
  }, []);

  // First-party page_view on every route change (skip admin area)
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    // Skip the very first render double-fire in dev StrictMode
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    }
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
