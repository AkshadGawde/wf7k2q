import type { Filters, HorizonResponse, Meta, MetricsResponse, TimeseriesResponse } from './types'

// Backend origin. Set VITE_API_URL at build time (e.g. the backend's Vercel URL); it
// defaults to the local FastAPI server. An empty string means same-origin, which the
// Docker image uses because nginx proxies /api to the backend container.
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')
const BASE = `${API_URL}/api`

async function get<T>(path: string, params: Record<string, string | number> = {}, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))
  const response = await fetch(`${BASE}${path}?${query}`, { signal })
  if (!response.ok) {
    // FastAPI errors carry a `detail` field (string, or a list for validation errors).
    const body = await response.json().catch(() => null)
    const detail = typeof body?.detail === 'string' ? body.detail : `Request failed (${response.status})`
    throw new Error(detail)
  }
  return response.json() as Promise<T>
}

const rangeParams = (f: Filters) => ({
  start: f.start,
  end: f.end,
  cutoff_time: f.cutoffTime,
  cutoff_days_before: f.cutoffDaysBefore,
})

export const api = {
  meta: (signal?: AbortSignal) => get<Meta>('/meta', {}, signal),
  timeseries: (f: Filters, signal?: AbortSignal) => get<TimeseriesResponse>('/timeseries', rangeParams(f), signal),
  metrics: (f: Filters, signal?: AbortSignal) =>
    get<MetricsResponse>('/metrics', { ...rangeParams(f), confidence: f.confidence }, signal),
  horizon: (f: Filters, signal?: AbortSignal) =>
    get<HorizonResponse>('/horizon', { start: f.start, end: f.end, bucket_hours: 3 }, signal),
}
