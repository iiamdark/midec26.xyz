// Datos sacados del canal de YouTube @MarkhoES (octubre 2026).
export const artist = 'MARKHO';
export const formerly = 'midec26';
export const tagline = 'Artista emergente español · Género urbano';

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/musica', label: 'Música' },
  { href: '/videos', label: 'Vídeos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contacto', label: 'Contacto' },
];

export const youtube = 'https://www.youtube.com/@MarkhoES';
export const instagram = 'https://www.instagram.com/marc_puente08';
export const email = 'midecubos@gmail.com';

export interface Song { id: string; t: string; k: string; y: string; dur: string; color: 'blue' | 'coral' | 'white' }
// Más reciente primero.
export const songs: Song[] = [
  { id: 'YGt95E2D3go', t: 'San Valentín', k: 'Visualizer', y: '2026', dur: '2:53', color: 'coral' },
  { id: 'BWlaL_6-JOE', t: 'Como si nada', k: 'Visualizer', y: '2026', dur: '2:11', color: 'blue' },
  { id: 'okZgYt5MAJ4', t: 'Entre Sombras y Luces', k: 'Videoclip oficial', y: '2025', dur: '2:53', color: 'white' },
  { id: 'OWHzjMbR9uQ', t: 'Si Estuvieras Aquí', k: 'Cover', y: '2025', dur: '3:29', color: 'blue' },
];

export const thumb = (id: string) => `/img/${id}.jpg`;
export const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const socials = [
  { label: 'YouTube', href: youtube },
  { label: 'Instagram', href: instagram },
];
