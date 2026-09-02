import { createClient } from '@/lib/supabase/client';
import { TrackingSettings } from '@/lib/types';

export const DEFAULT_TRACKING_SETTINGS: TrackingSettings = {
  ga4_measurement_id: '',
  gtm_container_id: '',
  meta_pixel_id: '',
  tiktok_pixel_id: '',
  custom_head_scripts: '',
  custom_body_scripts: '',
};

export async function getTrackingSettings(): Promise<TrackingSettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'tracking')
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_TRACKING_SETTINGS;
  return { ...DEFAULT_TRACKING_SETTINGS, ...(data.value as TrackingSettings) };
}

/** Synchronous read for the script injector (client-only). */
export function getTrackingSettingsSync(): TrackingSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('daroodi_tracking_settings');
    if (raw) return { ...DEFAULT_TRACKING_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_TRACKING_SETTINGS;
}

export async function saveTrackingSettings(settings: TrackingSettings): Promise<TrackingSettings> {
  const supabase = createClient();
  const payload: TrackingSettings = { ...settings, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'tracking', value: payload, updated_at: payload.updated_at });
  if (error) throw error;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('daroodi_tracking_settings', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('daroodi:settings-updated'));
  }
  return payload;
}
