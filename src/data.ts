// Datos sacados de Spotify y del canal de YouTube @MarkhoES (octubre 2026).
export const artist = 'MARKHO';
export const formerly = 'midec26';
export const tagline = 'Artista emergente español · Género urbano';
export const site = 'https://midec26.xyz';

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/musica', label: 'Música' },
  { href: '/videos', label: 'Vídeos' },
  { href: '/clips', label: 'Clips' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contacto', label: 'Contacto' },
];

export const spotifyId = '62PCBFxD6IB7B3DcVheIJp';
export const spotify = `https://open.spotify.com/artist/${spotifyId}`;
export const youtube = 'https://www.youtube.com/@MarkhoES';
export const instagramUser = 'rial_markho';
export const instagram = `https://www.instagram.com/${instagramUser}/`;
export const email = 'midecubos@gmail.com';

export type Color = 'blue' | 'coral' | 'white';
export interface Song {
  slug: string; t: string; date: string; dur: string;
  spotify: string; youtube?: string; explicit?: boolean; color: Color;
}
// Singles en Spotify, más reciente primero.
export const songs: Song[] = [
  { slug: 'san-valentin', t: 'San Valentín', date: '2026-07-24', dur: '2:51', spotify: '0FDdG1ZYNEHfE83WNCAp3u', youtube: 'YGt95E2D3go', explicit: true, color: 'coral' },
  { slug: 'otra-noche-mala', t: 'otra noche mala', date: '2026-06-05', dur: '2:50', spotify: '31nBNBk0WTlY2ImhqL0by4', color: 'blue' },
  { slug: 'como-si-nada', t: 'como si nada', date: '2026-05-24', dur: '2:14', spotify: '5tKnfZkIQIlqz6WyEGniTE', youtube: 'BWlaL_6-JOE', color: 'white' },
  { slug: 'ella-ella-ella', t: 'Ella Ella Ella', date: '2026-03-05', dur: '2:45', spotify: '7034S4K1kVbdCmIWaM2HfH', explicit: true, color: 'coral' },
  { slug: 'entre-sombras-y-luces', t: 'Entre Sombras y Luces', date: '2025-10-23', dur: '2:53', spotify: '1uoUt868ZsXBUzwR2snU7x', youtube: 'okZgYt5MAJ4', explicit: true, color: 'blue' },
];

export interface Video { id: string; t: string; k: string; y: string; dur: string }
export const videos: Video[] = [
  { id: 'YGt95E2D3go', t: 'San Valentín', k: 'Visualizer', y: '2026', dur: '2:53' },
  { id: 'BWlaL_6-JOE', t: 'Como si nada', k: 'Visualizer', y: '2026', dur: '2:11' },
  { id: 'okZgYt5MAJ4', t: 'Entre Sombras y Luces', k: 'Videoclip oficial', y: '2025', dur: '2:53' },
  { id: 'OWHzjMbR9uQ', t: 'Si Estuvieras Aquí', k: 'Cover', y: '2025', dur: '3:29' },
];

export const cover = (s: Song) => `/img/cover-${s.slug}.jpg`;
export const thumb = (id: string) => `/img/${id}.jpg`;
export const trackUrl = (s: Song) => `https://open.spotify.com/track/${s.spotify}`;
const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fmtDate = (iso: string) => { const [y, m, d] = iso.split('-'); return `${+d} ${months[+m - 1]} ${y}`; };

export const socials = [
  { label: 'Spotify', href: spotify },
  { label: 'YouTube', href: youtube },
  { label: 'Instagram', href: instagram },
];

// Reels de Instagram (@rial_markho), más reciente primero.
export interface Reel { id: string; date: string }
export const reels: Reel[] = [
  { id: 'DeTvw5oOvDW', date: '2026-10-10' },
  { id: 'DeB1Ke-OvB-', date: '2026-10-03' },
  { id: 'DY2ZM09s4Mg', date: '2026-05-27' },
  { id: 'DWg-jqEDJr6', date: '2026-03-30' },
  { id: 'DWEHZcSjD_g', date: '2026-03-19' },
  { id: 'DVE2zVnjN2r', date: '2026-02-22' },
  { id: 'DUATVf0DDPY', date: '2026-01-26' },
  { id: 'DS8zmbmjByj', date: '2025-12-31' },
  { id: 'DQM6HwbDD8v', date: '2025-10-24' },
  { id: 'DPruZp0DP-u', date: '2025-10-11' },
];
export const reelThumb = (r: Reel) => `/img/reels/${r.id}.jpg`;
export const reelUrl = (r: Reel) => `https://www.instagram.com/reel/${r.id}/`;

// Colaboraciones con otros artistas.
export interface Collab { t: string; artists: string; with: { name: string; href: string }; youtube: string; k: string; date: string; dur: string; project?: string }
export const collabs: Collab[] = [
  {
    t: 'MÖET', artists: 'EL CAPI, Midec26', with: { name: 'El Capi', href: 'https://www.youtube.com/@ElCapi-ds' },
    youtube: 'PKRYA2fHRZ8', k: 'Visualizer oficial', date: '2025-06-20', dur: '3:11', project: 'SUEÑO ZZZ',
  },
];
