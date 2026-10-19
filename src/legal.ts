// Datos legales y de publicidad. RELLENA los campos marcados con TODO antes
// de activar los anuncios: la LSSI-CE (art. 10) obliga a mostrar quién es el
// titular de una web que genera ingresos.
export const legal = {
  owner: 'TODO: nombre y apellidos del titular',
  nif: 'TODO: NIF/DNI',
  address: 'TODO: domicilio (calle, CP, ciudad, provincia)',
  email: 'midecubos@gmail.com',
  domain: 'midec26.xyz',
  updated: '19 de octubre de 2026',
};

// Google AdSense. Pega aquí tu ID de editor ("ca-pub-XXXXXXXXXXXXXXXX") y,
// opcionalmente, el ID de cada bloque de anuncios. Mientras adsenseClient
// esté vacío no se carga ningún anuncio ni script de Google.
export const ads = {
  adsenseClient: 'ca-pub-7097157436814477',
  slots: {
    home: '',
    music: '',
    song: '',
  },
};

export const adsEnabled = () => /^ca-pub-\d{10,20}$/.test(ads.adsenseClient);

export const legalLinks = [
  { href: '/legal/aviso-legal', label: 'Aviso legal' },
  { href: '/legal/privacidad', label: 'Privacidad' },
  { href: '/legal/cookies', label: 'Cookies' },
  { href: '/legal/terminos', label: 'Términos' },
];
