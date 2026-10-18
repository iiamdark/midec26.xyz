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
export const appleMusic = 'https://music.apple.com/es/artist/markho/1850461272';
export const label = 'Deck Music';
export const instagramUser = 'rial_markho';
export const instagram = `https://www.instagram.com/${instagramUser}/`;
export const email = 'midecubos@gmail.com';

export type Color = 'blue' | 'coral' | 'white';
export interface Credits { producer?: string; mix?: string; master?: string; cover?: string; writers?: string }
export interface Song {
  slug: string; t: string; date: string; dur: string;
  spotify: string; apple?: string; youtube?: string; explicit?: boolean; color: Color;
  credits?: Credits;
  // Letra: estrofas separadas por una línea en blanco. Una línea que empieza
  // por "* " es una frase destacada y una que empieza por "> " es hablada.
  // Las estrofas repetidas se marcan solas como estribillo.
  lyrics?: string;
  // Decoración animada junto a la letra.
  decor?: 'heart' | 'phone' | 'light';
}
// Singles en Spotify, más reciente primero.
export const songs: Song[] = [
  { slug: 'san-valentin', apple: 'https://music.apple.com/es/album/san-valent%C3%ADn/6792689093?i=6792689094', t: 'San Valentín', date: '2026-07-24', dur: '2:51', spotify: '0FDdG1ZYNEHfE83WNCAp3u', youtube: 'YGt95E2D3go', explicit: true, color: 'coral', decor: 'heart',
    lyrics: `Extraño tu cama como si fuera mía
Que tú me echas de menos eso ya lo sabía
Que tu madre y tu padre aún me tienen manía
Me hubiese gustado tener la cercanía

De decírtelo a ti
Y ahora que estoy solo letras tristes voa' escribir
Encima lo dejamos el día de San Valentín
* Cupido me ha castigado por ser tan infantil

No nos llevamos bien así que mami ya vete
Que tus mensajes se sienten como un machete
* Seguiré llorando por ti aunque tenga 27
Me duele la barriga, no me llena un banquete
Me llenan tus gemidos que gritas cuando te vienes

Al final no tuvimos nenes
Secuestrados como dos rehenes
En este amor que no se sostiene
Tú que que coger dos trenes

Pa' coger mi sudadera que aún la tenías tú
* Y no tuve el valor

De decírtelo a ti
Y ahora que estoy solo letras tristes voa' escribir
Encima lo dejamos el día de San Valentín
Cupido me ha castigado por ser tan infantil

No nos llevamos bien así que mami ya vete

> Al final todo pasa por algo
> Si el mundo no quiere, no tenemos por qué empeñarnos a estar juntos
> Has sido lo más bonito que me ha pasado en mi vida, la verdad
> Y sé que nunca te lo digo porque me cuesta
> Pero creo que por fin puedo decir que he tenido el valor

De decírtelo a ti
Y ahora que estoy solo letras tristes voa' escribir
Encima lo dejamos el día de San Valentín
Cupido me ha castigado por ser tan infantil

* No nos llevamos bien así que mami ya vete`,
  },
  { slug: 'otra-noche-mala', apple: 'https://music.apple.com/es/album/otra-noche-mala/6773278814?i=6773278815', t: 'otra noche mala', date: '2026-06-05', dur: '2:50', spotify: '31nBNBk0WTlY2ImhqL0by4', color: 'blue' },
  { slug: 'como-si-nada', apple: 'https://music.apple.com/es/album/como-si-nada/6777631745?i=6777631746', t: 'como si nada', date: '2026-05-24', dur: '2:14', spotify: '5tKnfZkIQIlqz6WyEGniTE', youtube: 'BWlaL_6-JOE', color: 'white', decor: 'phone',
    lyrics: `Mami, sigues con él y quería verte, baby
Me mentiste pero sigo aquí esperando en el centro de Madrid
Sabía que no cambiarías
Hicimos el amor, te enfadaste por tonterías

Mami
Tú siempre que hablas la cagas, porfa no digas nada
Sé que me echas de menos, quiero tu llamada
Y volver otra vez a dejarte mojada
* Y después saludarnos como si nada

Baby, no era tan fácil cuando estaba a tu lado
Hasta parecía que me habías olvidado
Después yo descubrí que me habías bloqueado
* Pero sigo en tu fondo de pantalla guardado

Un perreo duro con un conjunto Versace
Yo la quiero mucho, no quiero que me rechace
Hablando solo en una bici tropezando con los baches
* Celosa como un tigre, carroñera cual mapache

Bebé, ya van como 10 días que tú te alejaste de mí
Desde que tú ya no eres mía
Y quiero ser tuyo en la noche y por el día
* Así que vamo' a hacerlo to' los días de tu vida`,
  },
  { slug: 'ella-ella-ella', apple: 'https://music.apple.com/es/album/ella-ella-ella/1889116083?i=1889116084', t: 'Ella Ella Ella', date: '2026-03-05', dur: '2:45', spotify: '7034S4K1kVbdCmIWaM2HfH', explicit: true, color: 'coral' },
  { slug: 'entre-sombras-y-luces', apple: 'https://music.apple.com/es/album/entre-sombras-y-luces/1850472087?i=1850472088', t: 'Entre Sombras y Luces', date: '2025-10-23', dur: '2:53', spotify: '1uoUt868ZsXBUzwR2snU7x', youtube: 'okZgYt5MAJ4', explicit: true, color: 'blue', decor: 'light',
    lyrics: `Entraste al party y se apagó la disco
Brillabas tanto que hasta el humo se hizo listo
Dices que no buscas nada, pero siempre insisto
Tus labios hablan más que todo lo que has dicho

Aunque digas que no quieres repetir
* Se nota que en tu piel aún me guardas un sitio a mí

Entre sombras y luces, tú y yo nos perdimos
Jugamos con fuego, y al fuego nos fuimos
Decías que era un error, pero caímos
* Lo prohibido siempre sabe lo que elegimos

La cama, un ring, sudando como atletas
Tú eras mi gol en el minuto noventa
Me pedías calma y yo rompía las reglas
Amor clandestino, firmado en libreta

* La noche testigo, la luna notario
Tus besos delito, tu piel escenario
Y aunque la City nunca duerme
Siempre encontramos un hueco para pecar a diario

* Dices que soy tu error favorito
Pero vuelves al delito
Como botella en la mano
Que sabes que te mata... y aun así pides otro traguito
No has aprendido nada, solo nos entendemos en la cama

Entre sombras y luces, tú y yo nos perdimos
Jugamos con fuego, y al fuego nos fuimos
Decías que era un error, pero caímos
Lo prohibido siempre sabe lo que elegimos

Entre sombras y luces, tú y yo nos perdimos
Jugamos con fuego, y al fuego nos fuimos
Decías que era un error, pero caímos
* Lo prohibido siempre sabe lo que elegimos`,
  },
];

export interface Video { id: string; t: string; k: string; y: string; dur: string }
export const videos: Video[] = [
  { id: 'YGt95E2D3go', t: 'San Valentín', k: 'Visualizer', y: '2026', dur: '2:53' },
  { id: 'BWlaL_6-JOE', t: 'Como si nada', k: 'Visualizer', y: '2026', dur: '2:11' },
  { id: 'okZgYt5MAJ4', t: 'Entre Sombras y Luces', k: 'Videoclip oficial', y: '2025', dur: '2:53' },
  { id: 'OWHzjMbR9uQ', t: 'Si Estuvieras Aquí', k: 'Cover', y: '2025', dur: '3:29' },
];

export const platforms = (s: Song) => [
  { label: 'Spotify', href: trackUrl(s) },
  ...(s.apple ? [{ label: 'Apple Music', href: s.apple }] : []),
  ...(s.youtube ? [{ label: 'YouTube', href: `https://www.youtube.com/watch?v=${s.youtube}` }] : []),
];
export const cover = (s: Song) => `/img/cover-${s.slug}.jpg`;
export const thumb = (id: string) => `/img/${id}.jpg`;
export const trackUrl = (s: Song) => `https://open.spotify.com/track/${s.spotify}`;
const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fmtDate = (iso: string) => { const [y, m, d] = iso.split('-'); return `${+d} ${months[+m - 1]} ${y}`; };

export const socials = [
  { label: 'Spotify', href: spotify },
  { label: 'Apple Music', href: appleMusic },
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
