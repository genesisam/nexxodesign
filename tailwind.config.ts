import type { Config } from 'tailwindcss'

// Token values are CSS variables defined in globals.css — art-direct there, not here.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sanity/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // §7 palette — usa canales RGB para habilitar modificadores de opacidad
        // (text-ink/75, bg-paper/50, border-smoke/30, etc.)
        ink:    'rgb(var(--color-ink-rgb) / <alpha-value>)',
        paper:  'rgb(var(--color-paper-rgb) / <alpha-value>)',
        smoke:  'rgb(var(--color-smoke-rgb) / <alpha-value>)',
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        line:   'rgb(var(--color-line-rgb) / <alpha-value>)',
        clay:   'rgb(var(--color-clay-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      /*
       * La escala de títulos.
       *
       * Había sesenta tamaños puestos a mano, uno por sitio, y ninguna
       * relación entre ellos: en el teléfono el título de «trabajo
       * seleccionado» salía a 13,5vw —59 píxeles a 440— mientras el H1 de la
       * página medía 38. Cada sección decidía por su cuenta y el resultado
       * era que ninguna parecía más importante que otra.
       *
       * Son cuatro peldaños y se ordenan solos:
       *
       *   portada      el H1 de la página. Uno por página, y el mayor.
       *   declaracion  el manifiesto que ocupa una sección entera. Grande a
       *                propósito, pero por debajo de la portada.
       *   seccion      el H2 que nombra una sección. Rotula, no grita.
       *   bloque       el H3 de una pieza dentro de una sección.
       *
       * Solo fijan el cuerpo. El interlineado y el espaciado se quedan donde
       * estaban, en cada sitio, porque dependen del número de líneas y de si
       * el título va en caja alta.
       */
      /*
       * El radio de una pieza.
       *
       * Había seis radios distintos conviviendo —2rem, 1,75, 1,5, 1,25, 1 y
       * 0,6— y además las tarjetas de proyecto y de tienda iban a escuadra,
       * de modo que una misma página mezclaba esquinas redondas y rectas sin
       * criterio. Esto es el radio de cualquier cosa que enmarque una
       * imagen: tarjeta, muestra, pieza de un caso.
       *
       * Baja de los 32 píxeles de antes y baja un poco más en el teléfono,
       * donde la pieza es más pequeña y el mismo radio se come más esquina:
       * 14 en un móvil, 20 en escritorio.
       */
      borderRadius: {
        pieza: 'clamp(0.875rem, 1.4vw, 1.25rem)',
      },
      fontSize: {
        /*
         * El cuerpo de texto.
         *
         * Los topes estaban puestos para una pantalla de portátil y no se
         * movían de ahí: el párrafo de un capítulo topaba en 1,1rem —17,6
         * píxeles— daba igual que la pantalla midiera 1440 o 2560. En un
         * monitor grande eso es un texto diminuto dentro de una columna
         * enorme.
         *
         * Estos crecen con la ventana y siguen teniendo tope, porque una
         * línea de lectura tampoco puede dispararse:
         *
         *   cuerpo      16 -> 20 -> 24 px   (390 / 1440 / 2560)
         *   cuerpo-lg   18 -> 26 -> 35 px   la entradilla de un caso
         *   cuerpo-sm   15 -> 18 -> 21 px   pies y notas al margen
         */
        cuerpo:      'clamp(1rem, 0.72rem + 0.6vw, 1.5rem)',
        'cuerpo-lg': 'clamp(1.12rem, 0.52rem + 1.15vw, 2.2rem)',
        'cuerpo-sm': 'clamp(0.95rem, 0.82rem + 0.36vw, 1.3rem)',
        /* La cubierta de un caso va un peldaño por encima de la portada de
           una página: es la primera plana de una historia, no el titular de
           una sección. Estaba en 11vw —64 píxeles en un teléfono y 158 en
           escritorio— decidido por su cuenta y sin relación con nada. */
        cubierta:    'clamp(3.2rem, 8.4vw, 8.4rem)',
        portada:     'clamp(2.6rem, 6.4vw, 6.4rem)',
        declaracion: 'clamp(2.1rem, 5.2vw, 5.2rem)',
        seccion:     'clamp(1.8rem, 4.2vw, 4.2rem)',
        bloque:      'clamp(1.4rem, 2.4vw, 2.3rem)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'out-expo':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}

export default config
