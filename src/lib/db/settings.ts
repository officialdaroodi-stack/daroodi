import { supabase } from '@/lib/supabase/client';
import { TrackingSettings } from '@/lib/types';

const SETTINGS_STORAGE_KEY = 'daroodi_db_settings';

export const DEFAULT_TRACKING_SETTINGS: TrackingSettings = {
  ga4_measurement_id: '',
  gtm_container_id: '',
  meta_pixel_id: '',
  tiktok_pixel_id: '',
  custom_head_scripts: '',
  custom_body_scripts: '',
};

export async function getTrackingSettings(): Promise<TrackingSettings> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_TRACKING_SETTINGS, ...JSON.parse(stored) };
      }
    }

    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'tracking')
      .single();

    if (data?.value) {
      const parsed = { ...DEFAULT_TRACKING_SETTINGS, ...(data.value as TrackingSettings) };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch {
    // Graceful fallback
  }
  return DEFAULT_TRACKING_SETTINGS;
}

/** Synchronous read for script injection (client-only). Returns null on server. */
export function getTrackingSettingsSync(): TrackingSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_TRACKING_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_TRACKING_SETTINGS;
}

export async function saveTrackingSettings(settings: TrackingSettings): Promise<TrackingSettings> {
  const payload: TrackingSettings = { ...settings, updated_at: new Date().toISOString() };

  try {
    await supabase
      .from('site_settings')
      .upsert({ key: 'tracking', value: payload, updated_at: payload.updated_at });
  } catch {
    // Graceful fallback
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    // Notify the script injector (same-tab update)
    window.dispatchEvent(new CustomEvent('daroodi:settings-updated'));
  }

  return payload;
}
