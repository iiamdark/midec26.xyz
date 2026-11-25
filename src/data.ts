// Datos sacados de Spotify y del canal de YouTube @MarkhoES (noviembre 2026).
export const artist = 'MARKHO';
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
  spotify?: string; project?: string; apple?: string; youtube?: string; explicit?: boolean; color: Color;
  credits?: Credits;
  // Letra: estrofas separadas por una línea en blanco. Una línea que empieza
  // por "* " es una frase destacada y una que empieza por "> " es hablada.
  // Las estrofas repetidas se marcan solas como estribillo.
  lyrics?: string;
  artwork?: string;
  coverNotes?: string;
  lyricsInVideoDescription?: boolean;
  // Decoración animada junto a la letra.
  decor?: 'heart' | 'phone' | 'light';
}
// Canciones, más recientes primero. Las plataformas se incluyen solo cuando están verificadas.
export const songs: Song[] = [
  { slug: 'animal', t: 'Animal', date: '2026-11-13', dur: '2:19', youtube: 'ynMqdsAylIA', color: 'coral', project: 'Mañana',
    credits: { writers: 'Marc Puente Reyes', producer: 'Classy, Markho' },
    lyrics: `No me llames si es para hablar de amor
tengo la cabeza puesta en algo mayor
desde abajo construyendo mi lugar
si me caigo, vuelvo arriba, así de natural

y la dejé llorando, pero es que me da igual
Sorry, es que soy un animal
que no quiera algo serio a ellas las deja mal
Sorry, es que soy un animal
el pecho congelado, corazón de metal
Sorry, es que soy un animal
pensando en billetes, nada sentimental
Sorry, es que soy un animal

tengo veinte planes dentro del mismo plan
mientras ellos duermen, yo pensando en facturar
quieren verme abajo, no me van a encontrar
cada fallo que tuve me enseñó a despegar

ella dice que conmigo todo parece irreal
pero yo estoy demasiado enfocado en avanzar
no prometo para siempre, eso sería falsedad
si mañana cambia todo, cada cual por su lugar

tengo el móvil lleno, pero nunca estoy online
mil mensajes sin respuesta, tengo cosas que cerrar
no es que sea mala gente, soy difícil de alcanzar
tengo el fuego muy alto, ya no lo puedo apagar

no me mueve la presión, me motiva demostrar
que aquel niño con sus sueños algún día va a llegar
no persigo corazones, persigo algo más global
quiero luces, escenarios, hacer historia al final

y la dejé llorando, pero es que me da igual
Sorry, es que soy un animal
que no quiera algo serio a ellas las deja mal
Sorry, es que soy un animal
el pecho congelado, corazón de metal
Sorry, es que soy un animal
pensando en billetes, nada sentimental
Sorry, es que soy un animal

ahora todos quieren parte cuando empieza a funcionar
pero nadie estaba cerca cuando todo estaba mal
yo recuerdo cada noche, cada duda, cada plan
por eso, si consigo algo, no lo pienso regalar

mamá dice: «Ten cuidado»; yo le digo: «Todo bien»
aunque dentro de mi mente siempre estoy buscando cien
cien motivos pa' seguir, cien razones pa' crecer
y aunque quieran verme abajo, me levanto otra vez`,
  },
  { slug: 'tomorrow-on-top', t: 'Tomorrow on Top', date: '2026-11-13', dur: '2:32', youtube: 'yt3t-TYQsgI', color: 'blue', project: 'Mañana',
    credits: { writers: 'Marc Puente Reyes', producer: 'Kampos, Markho' },
    lyrics: `No tengo ni la edad para meterme tinta
Pero hago más que la gente de mi quinta
Mientras ellos hablan, yo cambio la pinta
Voy por mi camino, mi mente es distinta

No voy a parar hasta pegar un tema
Pero es que, cabrón, todo lo que hago es crema
Mis letras ya se consideran problemas
Como Agustín, voy rompiendo esquemas

Todo lo mío se queda privado
No sabían que venía preparado
Estoy empezando, voy decidido
Hasta la cima no doy por vencido

Se queda privado, keep it locked
Voy por la cima, never gonna stop
En un futuro querrán ver mi POV
Hoy no me conocen, tomorrow on top

Salgo del barrio con flow Palomino
Corriendo por el beat como Minamino
Todo lo que toco lo convierto en fino
Brindando en lo alto una copa de vino

Yo lo hago a mano, sin manual
Noches con los míos, de forma habitual
Creando mi mundo conceptual
Ya no quiero estar en el mundo virtual

Más de mil letras escritas en las notas
Soy una ardilla en busca de bellotas
Te critico a ti, me da igual a quién votas
Total, los de arriba son todos idiotas

(Me la puto suda quién coño se ponga delante
La gente ya me parece irrelevante)

Todo lo mío se queda privado
No sabían que venía preparado
Estoy empezando, voy decidido
Hasta la cima no doy por vencido

Se queda privado, keep it locked
Voy por la cima, never gonna stop
En un futuro querrán ver mi POV
Hoy no me conocen, tomorrow on top`,
  },
  { slug: 'level-up', t: 'level up', date: '2026-11-13', dur: '2:38', youtube: 'XN2htWIrcbc', color: 'white', project: 'Mañana',
    credits: { writers: 'Marc Puente Reyes', producer: 'Wizard, Markho' },
    lyrics: `Aunque no tenga rebeldía
tengo todas mis melodías
ojalá que mi abuelo hubiera visto lo muy rápido que ascendía
la gente a mí no me entendía
pero yo siempre daba el máximo
mientras vosotros dabais lo básico
y escribía letras día a día

ya estaba cantando en el vientre
ahora estoy dañao' para siempre
pero eso no quita que en un par de años pueda llenar un WiZink Center
quien me quiera de verdad, que entre
pero, porfa, que no me distraiga
que sus palabras retraiga
y que deje que me concentre

pa' lanzar estas barras, duelen como garras y no dejan reaccionar
estoy harto de guitarras, de beber jarras y de pedir pa' cenar
quiero algo auténtico, con los míos, sin temer a abandonar
pero que sea ético, ya que hay que saber cuándo frenar

Palace y Stüssy, no caigo ni el ollie
pero te puedo engañar como Loki
puedo escribir aun tirándome el boli
y mientras te escucho un tema de Jory

con el Gadgetrón como Ratchet
a lo Topuria, meto un crochet
salimos de día, de noche
con mi colega, también con su coche

tengo la piel en carne viva
pintura que tu car necesita
he llegado a buscar neblinas
si esto no sale, estoy en la ruina

pero no importa porque saldrá
tarde o temprano, como GTA
cualquier disco de platino valdrá
para poder llenar mi saciedad

desde abajo, poco a poco, estamos subiendo el nivel
yo juego con ellos como un gato con su cascabel
también me como unos quesitos, Mini Babybel
y me muero con la corona puesta, flow Isabel

(desde abajo, poco a poco, estamos subiendo el nivel
yo juego con ellos como un gato con su cascabel
también me como unos quesitos, Mini Babybel
y me muero con la corona puesta, flow Isabel)

me tomo el café en una copa de vino
le hablaste a mi ex, pero al final no vino
tengo mil fragancias, yo soy Valentino
Ted Bundy, yo soy asesino

yo loco, loco, y ella loquita
yo lo coloco y ella lo quita
voy a explotar como dinamita
si esta petarda a mí me limita

para hacer rap no hacen falta porros
voy un momento y luego me forro
tengo banderas; yo soy el zorro
S.O.S., sin pedir socorro

no me hace falta ayuda
ni a nadie que me influya
yo en la mía y tú en la tuya
yo no pienso, dejo que fluya`,
  },
  { slug: 'scorsese', t: 'Scorsese', date: '2026-11-13', dur: '2:12', youtube: 'oIOCnQZN9S8', color: 'coral', project: 'Mañana',
    credits: { writers: 'Marc Puente Reyes' },
    lyrics: `Si la gente no confía en mí
yo confiaré en mí
en TikTok no salgo en Para Ti
pero estoy para ti
tic-tac, ya he hecho mil
y a ellos me los bebo como milk

desde el atril doy clases a universitarios
siendo menor que ellos, tengo mis propios horarios
no hace falta tomarse la vida en serio
me río delante del que me regaña y después me pongo serio

infancia normal
con la gente difícil
soy antisocial
solo sale más fácil

yo no haré el mal
tampoco soy imbécil
no soy un animal
yo soy poco dócil

con el micro de 100 pavos grabaré esta mierda
envíaselo a alguno de tus alumnos para que aprenda
tengo vacía la agenda
y en mi tienda compras cada una de tus prendas

te gano la mano con un siete y un dos
dosis diaria de fútbol: pases de Toni Kroos
ritmo de competidor, precisión de cirujano
subo la tensión, decisión de veterano

viendo la maría que se mueve en Can Rull
las obras de las esquinas con gente de cuello azul
pocos hablan de lo suyo; cada cual carga su cruz
historias que no salen ni aunque busques en YouTube

mi ciudad bajo la niebla es un plano de Scorsese
importa lo que haces tú, no importa lo que haga ese
en el Passat con mi man, bajando haciendo eses
me he follao' la instrumental, verás en nueve meses

no confío en los espejos; el de ahí no soy yo
porque el que está en el reflejo no huele a Christian Dior
sigo subiendo plantas como un ascensor
que funciona con letras y aceite de motor

no trabajo en el campo, porque no es mi campo
sentado en el banco, consultando la app del banco
no tengo capital, pero estoy en la capital
del Vallès Occidental, aquí todo es mental, qué mal

ser tan joven y comérmelos a todos
para cumplir mi sueño, lo haría de cualquier modo
tengo que soñar, pero no dormirme
a las siete ya me encuentras firme

firmé un par de camisetas; ahora valen una pasta
me río de ellos mientras voy comiendo pasta
pa' estar solo, me busco una casa, yeah
ya da igual lo que me digas; mis locales se traspasan`,
  },
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
    credits: { writers: 'Marc Puente Reyes', producer: 'Markho' },
    lyrics: `mami sigues con él y quería verte
baby, me mentiste pero sigo aquí en
esperando en el centro de Madrid,
sabía que no cambiarías, hicimos el amor, te enfadaste por tonterías

mami tu siempre que hablas la cagas
porfa no digas nada, se que me echas de menos, quiero tu llamada
y volver otra vez a dejarte mojada
* y después saludarnos como si nada.

baby no era tan fácil cuando estaba a tu lado,
hasta parecías que me habías olvidado,
después yo descubrí que me habías bloqueado,
* pero sigo en tu fondo de pantalla guardado.

un perreo duro con un conjunto Versace,
yo la quiero mucho no quiero que me rechace,
hablando solo en una bici tropezando con los baches,
* celosa como un tigre, carroñera cual mapache.

bebé ya van como 10 días que tú te alejaste de mi,
desde que tú ya no eres mía
y quiero ser tuyo en la noche y por el día
* así que vamo' a hacerlo to' los dias de tu vida`,
  },
  { slug: 'ella-ella-ella', apple: 'https://music.apple.com/es/album/ella-ella-ella/1889116083?i=1889116084', t: 'Ella Ella Ella', date: '2026-03-05', dur: '2:45', spotify: '7034S4K1kVbdCmIWaM2HfH', explicit: true, color: 'coral' },
  { slug: 'entre-sombras-y-luces', apple: 'https://music.apple.com/es/album/entre-sombras-y-luces/1850472087?i=1850472088', t: 'Entre Sombras y Luces', date: '2025-10-23', dur: '2:53', spotify: '1uoUt868ZsXBUzwR2snU7x', youtube: 'okZgYt5MAJ4', explicit: true, color: 'blue', decor: 'light',
    credits: { writers: 'Marc Puente Reyes', producer: 'Jowy Beats' },
    lyrics: `Entraste al party y se apagó la disco,
brillabas tanto que hasta el humo se hizo listo,
dices que no buscas nada, pero siempre insisto,
tus labios hablan más que todo lo que has dicho.

Aunque digas que no quieres repetir,
* se nota que en tu piel aún me guardas un sitio a mí.

Entre sombras y luces, tú y yo nos perdimos,
jugamos con fuego, y al fuego nos fuimos,
decías que era un error, pero caímos,
* lo prohibido siempre sabe lo que elegimos.

La cama, un ring, sudando como atletas,
tú eras mi gol en el minuto noventa,
me pedías calma y yo rompía las reglas,
amor clandestino, firmado en libreta.

* La noche testigo, la luna notario,
tus besos delito, tu piel escenario,
y aunque la City nunca duerme,
siempre encontramos un hueco para pecar a diario.

* Dices que soy tu error favorito,
pero vuelves al delito,
como botella en la mano,
que sabes que te mata... y aun así pides otro traguito.

No has aprendido nada, solo nos entendemos en la cama

Entre sombras y luces, tú y yo nos perdimos,
jugamos con fuego, y al fuego nos fuimos,
decías que era un error, pero caímos,
lo prohibido siempre sabe lo que elegimos.

Entre sombras y luces, tú y yo nos perdimos,
jugamos con fuego, y al fuego nos fuimos,
decías que era un error, pero caímos,
* lo prohibido siempre sabe lo que elegimos.`,
  },
  { slug: 'si-estuvieras-aqui', t: 'Si Estuvieras Aquí', date: '2025-10-02', dur: '3:29', youtube: 'OWHzjMbR9uQ', color: 'blue', project: 'Cover',
    artwork: '/img/OWHzjMbR9uQ.jpg',
    coverNotes: 'Cover de «Pase lo que pase», de Saigo, que a su vez reinterpreta «De rogar», de Quevedo. Versión de Markho realizada con fines de entretenimiento.',
    lyrics: `(y ahora me la paso pensándote,
toa' la' noche desvelándome,
entre copas ahogándome)

pa' que hacernos de rogar,
que el que fallé fui yo pero exijo mi lugar
por mas que busque otro eso nunca va a cambiar
no me puedes reemplazar

y entre sus palabras te pierdes
pero te vuelves a encontrar cuando me ves
lo que es de casa a casa vuelve
y si no dime porque tu me tratas de interés

y sabes que pase lo que pase
jamás va a llegar nadie que lo de todo por ti
per también sabes que contigo me quite los disfrace'
duele la distancia per aun mas duele la frase
"si tu no estas aquí"

y si estuvieras aquí cerca
iría de nuevo, dime si ver te puedo
y si quieres dime dónde yo le llego
lo que me diga me atrevo

y sabes que pase lo que pase
jamás va a llegar nadie que lo de todo por ti
per también sabes que contigo me quite los disfrace'
duele la distancia per aun mas duele la frase
"si tu no estas aquí"

tu no estas feliz con ese man
no me olvida ni tomándose clonazepam
se viene conmigo cuando su amiga' se van
somo' polo' opuesto' por eso pegamos como imán ye

mami no te alejes si tu siempre vira'
puedo ser tu Tony con el money y tú elvira
si tu quieres estar conmigo entonces porque tira'
hablas mierda de mi pero nunca me olvidas

tu solo me quieres porque tu no amas a na'
labios compartidos pero yo no soy maná
sin corazón tu eres una carita na' mas
porque sigues con el y eso que es de panamá

y ahora me la paso pensándote,
toa' la' noche desvelándome,
entre copas ahogándome

y sabes que pase lo que pase
jamás va a llegar nadie que lo de todo por ti
per también sabes que contigo me quite los disfrace'
duele la distancia per aun mas duele la frase
"si tu no estas aquí"

y si estuvieras aquí cerca
iría de nuevo, dime si ver te puedo
y si quieres dime dónde yo le llego
lo que me diga me atrevo

y sabes que pase lo que pase
jamás va a llegar nadie que lo de todo por ti
per también sabes que contigo me quite los disfrace'
duele la distancia per aun mas duele la frase
"si tu no estas aquí"`,
  },
];

export interface Video { id: string; t: string; k: string; y: string; dur: string }
export const videos: Video[] = [
  {"id":"ynMqdsAylIA","t":"Animal","k":"Visualizer · Mañana","y":"2026","dur":"2:19"},
  {"id":"yt3t-TYQsgI","t":"Tomorrow on Top","k":"Visualizer · Mañana","y":"2026","dur":"2:32"},
  {"id":"XN2htWIrcbc","t":"level up","k":"Visualizer · Mañana","y":"2026","dur":"2:38"},
  {"id":"oIOCnQZN9S8","t":"Scorsese","k":"Visualizer · Mañana","y":"2026","dur":"2:12"},
  { id: 'YGt95E2D3go', t: 'San Valentín', k: 'Visualizer', y: '2026', dur: '2:53' },
  { id: 'BWlaL_6-JOE', t: 'Como si nada', k: 'Visualizer', y: '2026', dur: '2:11' },
  { id: 'okZgYt5MAJ4', t: 'Entre Sombras y Luces', k: 'Videoclip oficial', y: '2025', dur: '2:53' },
  { id: 'OWHzjMbR9uQ', t: 'Si Estuvieras Aquí', k: 'Cover', y: '2025', dur: '3:29' },
];

export const platforms = (s: Song) => [
  ...(s.spotify ? [{ label: 'Spotify', href: trackUrl(s) }] : []),
  ...(s.apple ? [{ label: 'Apple Music', href: s.apple }] : []),
  ...(s.youtube ? [{ label: 'YouTube', href: `https://www.youtube.com/watch?v=${s.youtube}` }] : []),
];
const newVideoIds = new Set(["ynMqdsAylIA","yt3t-TYQsgI","XN2htWIrcbc","oIOCnQZN9S8"]);
export const cover = (s: Song) => s.artwork ?? (s.youtube && newVideoIds.has(s.youtube)
  ? thumb(s.youtube)
  : `/img/cover-${s.slug}.jpg`);
export const thumb = (id: string) => newVideoIds.has(id)
  ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
  : `/img/${id}.jpg`;
export const trackUrl = (s: Song) => s.spotify
  ? `https://open.spotify.com/track/${s.spotify}`
  : `https://www.youtube.com/watch?v=${s.youtube}`;
export const playSource = (s: Song) => s.spotify ? `spotify:${s.spotify}` : `youtube:${s.youtube}`;
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
    t: 'MÖET', artists: 'EL CAPI, MARKHO', with: { name: 'El Capi', href: 'https://www.youtube.com/@ElCapi-ds' },
    youtube: 'PKRYA2fHRZ8', k: 'Visualizer oficial', date: '2025-06-20', dur: '3:11', project: 'SUEÑO ZZZ',
  },
];
