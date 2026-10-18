// Datos sacados de Spotify y del canal de YouTube @MarkhoES (octubre 2026).
export const artist = 'MARKHO';
export const formerly = 'midec26';
export const tagline = 'Artista emergente español · Género urbano';
export const site = 'https://midec26.xyz';

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/musica', label: 'Música' },
  { href: '/videos', label: 'Vídeos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contacto', label: 'Contacto' },
];

export const spotifyId = '62PCBFxD6IB7B3DcVheIJp';
export const spotify = `https://open.spotify.com/artist/${spotifyId}`;
export const youtube = 'https://www.youtube.com/@MarkhoES';
export const instagram = 'https://www.instagram.com/marc_puente08';
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
