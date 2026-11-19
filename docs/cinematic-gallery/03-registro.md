# Registro de avance — casos de proyecto

Estado real, comprobado contra el repositorio, el CMS y el sitio en vivo.
Actualizado: 18 de noviembre de 2026.

---

## Regla de imagen

**Dentro de los casos no entra ninguna imagen generada con IA.** Solo capturas
del producto real, exportaciones de Figma y elementos dibujados en código.

Los fondos de las ocho portadas sí son generados, y se quedan: la portada es
escenografía, no documentación del proyecto.

**Los separadores entre capítulos siguen la misma regla.** Son atmósfera, no
producto: un paisaje de la materia prima, nunca una pieza de ropa ni una
pantalla. En Maison, un campo de algodón a pantalla completa entre Sistema e
Implementación. Antes de él se probó una banda con la fotografía real del
lookbook del cliente, acreditada; se descartó porque enseñar su ropa en un
respiro compite con los capítulos donde la ropa sí viene a cuento.

El bloque `media` admite ahora `size: "bleed"` —de borde a borde y a altura
de ventana completa— y un campo `credito`, para cuando la pieza sí sea del
cliente.

---

## El espinazo

Los ocho casos comparten estos siete capítulos, en este orden:

**Tensión · Estrategia · Identidad · Producto · Sistema · Implementación · Resultados**

Antes cada caso tenía su forma —de 5 a 10 hitos— y los capítulos se llamaban
como reclamos: «El CRM que el equipo sí usa», «Alertas que activan, no que
informan», «La bici como nunca la habías visto». No se pueden indexar, no se
repiten entre proyectos y no dicen dónde estás. El primer capítulo tenía
cuatro nombres distintos según el caso y el último, dos.

Las frases no se tiran: pasan a titular el capítulo por dentro, que es donde
funcionan.

En la referencia, Sistema va antes que Producto. En Maison van al revés a
propósito, porque su capítulo móvil dice «diseñé la experiencia móvil en
paralelo al desktop» y moverlo delante rompería el texto.

### El capítulo de identidad

- **La apertura** arranca contenida —16/9, con márgenes y esquinas— y se abre
  al bajar hasta llenar la pantalla, con un acercamiento del 7 %. Lo mueve el
  recorte de la imagen, no la caja, así que no hay reflujo de maquetación.
- **Las muestras de color** enseñan el material al pasar por encima: papel de
  fibra, tinta de imprenta, canto de cartón, crepé de lana terracota.
- **El logotipo**, en dos paneles. A la izquierda sobre papel; al pasar por
  encima entra el color de la marca y el rótulo se vuelve blanco. A la
  derecha, sobre una lámina de crepé de seda en el petróleo de una de sus
  prendas, medido de su propia fotografía: `#016070`.

  El archivo del cliente venía en negro **sobre blanco opaco**, de modo que
  teñirlo con un filtro pintaba el rectángulo entero. Se le fabricó el canal
  alfa a partir de la luminancia, así que hay un solo archivo y el color se lo
  da CSS.

  La foto de modelo que había al principio se descartó: toda su fotografía es
  de fondo blanco —la más oscura da 182 de 255— y ni el blanco ni el logo
  encima se leían.

### Jerarquía

Dos escalones, no tres:

| | tamaño | qué es |
|---|---|---|
| capítulo | 96 px | el nombre del espinazo: Tensión, Estrategia… |
| subtítulo | 32 px | el titular del bloque, dentro del capítulo |

El bloque de texto era una rejilla de dos columnas —titular a la izquierda,
texto a la derecha— y como el capítulo ya trae su título encima, salían dos
títulos del mismo tamaño peleándose con el texto en una columna estrecha al
lado. Medido contra la referencia: allí hay **un título, debajo el texto en
una sola columna, y después la pieza**. Nada más. Los titulares de paleta y
tipografía iban a 50 px, a medio camino entre los dos niveles: bajados al
subtítulo.

La medida del texto ha pasado por tres estados hasta quedar bien, y los dos
primeros fueron errores míos: `max-w-[86ch]` —que resolvía `ch` contra el
contenedor y no contra el párrafo, dejando la línea en 690 px— y luego un tope
de 72 rem que dejaba 320 px de fondo vacío a la derecha en una ventana de
1.600. Ahora el párrafo ocupa el ancho del capítulo: 1.325 px a 1.440 de
ventana, 1.472 a 1.600, 1.760 a 1.920. El único tope que queda, 110 rem, está
para que en una pantalla de 2.560 la línea no se vuelva impracticable.

### Detalles de composición

- El hueco entre el nombre del capítulo y su texto era de **120 px** —56 de
  margen inferior del titular más 64 de margen superior del bloque—. Son dos
  piezas de lo mismo y tienen que leerse juntas: ahora **60 px**.
- Los subtítulos llevaban `max-w-[24ch]`, menos de lo que mide un titular
  normal: los siete salían partidos en dos líneas. A 46 caracteres, todos
  caben en una.
- La frase que cierra un bloque a página entera iba a 44 caracteres y se
  partía en dos; ahora cabe en una línea.
- **Los antetítulos** iban de 8 a 13 px, cada uno por su cuenta. A ese tamaño
  una versalita espaciada se intuye antes de leerse. Los 26 pasan a la misma
  medida: **12 px en móvil y 14 en escritorio**.
- **El bloque de texto a página entera** va todo en tinta sobre el color. El
  blanco solo era legal en el titular —sobre el terracota da 3,49:1, que pasa
  el umbral de texto grande pero no el de texto normal—, y eso dejaba la
  pieza a dos colores sin que la diferencia significara nada. En tinta va
  entera a 5,5:1. Su altura baja de 92 a 68 vh: el aire era respiro y se
  había vuelto hueco, sobre todo justo antes de una pieza a pantalla completa.
- **Viudas**: `text-pretty` en los párrafos y `text-balance` en los titulares,
  40 elementos en total. Es trabajo del navegador y no cuesta una línea de
  JavaScript; donde no se admite, el texto se rompe como siempre.

### Scroll horizontal: cerrado

El sitio entero hacía scroll lateral. Tres causas, ninguna evidente:

- **El pie.** Sus columnas entran animadas desde ±56 px, y GSAP aplica el
  estado de partida al montar, no cuando el disparador llega: mientras el pie
  estaba fuera de pantalla las columnas quedaban desplazadas y la página se
  iba 28 px. Se arregla con `immediateRender: false`, que es la causa, no el
  síntoma.
- **El acercamiento de la apertura.** Para que la línea de tiempo de scroll
  avanzara hice falta quitarle el recorte, y entonces la imagen al 1,06 se
  salía de la ventana. `overflow: clip` recorta igual que `hidden` pero no
  crea contenedor de scroll, así que la animación sigue viva.
- **La fila de botones** del encabezado del caso llevaba `shrink-0` y a 768
  sumaba 55 px más que la ventana.

Comprobado en 10 rutas × 6 anchos: **sin scroll horizontal en ninguna**.

### Aire y solape

- **Los bloques de color** pasan de 78 vh a **92 vh** (920 px en una ventana de
  1.000). En la referencia el cambio de color se siente porque hay aire
  alrededor, no porque el color cambie.
- **El texto quieto y la pieza subiendo por encima: probado y retirado.** Se
  hizo con `sticky` y se veía bien mientras la sección siguiente llenaba la
  pantalla. En cuanto una era más corta que la ventana, el texto pegado
  reaparecía por los huecos y se leían dos textos a la vez. Acotarlo al bloque
  siguiente tampoco bastó: el fantasma salía dos secciones más abajo. En la
  referencia funciona porque allí **todas** las secciones posteriores son de
  altura completa, y las nuestras no. Se quita entero en lugar de dejarlo a
  medias. Lo que sí se queda es que todas las secciones pinten en la misma
  capa, que era correcto y no dependía del efecto.
- **Piezas de la propia marca como separador.** El hueco entre capítulos se
  llena con la fotografía que el cliente ya tiene publicada —no se genera
  nada—. El bloque `media` admite `size: "bleed"` (de borde a borde, sin
  esquinas) y un campo `credito`, porque el diseño y el desarrollo son
  nuestros y la fotografía es suya. La primera va en Maison, cerrando Sistema:
  una banda de 2.400×1.000 con tres fotos del lookbook, acreditada.

### Contraste

Barrido automático de las hojas de texto de los ocho casos, mezclando la
opacidad con el fondo real heredado: **todas por encima de 3:1**. Antes había
22 por debajo. Dos causas:

- Los rótulos en versalitas iban a media opacidad: sobre negro colaban, sobre
  papel y sobre color se caían a 2,6:1.
- `legibleSobre` decidía blanco o negro con un umbral de 0,42 puesto a ojo. El
  corte real está donde las dos razones de WCAG se igualan, en **0,179**. Por
  eso los verdes medios de Merxo (L = 0,36) y Greenery se llevaban texto
  blanco a 2,5:1 cuando en negro daban 8:1.

### Tonos

Los capítulos alternan negro y papel, y **el último se viste del color de la
marca** del propio proyecto, sacado de su paleta: es donde está el resultado y
el testimonio. La identidad cae siempre en papel, porque unas muestras de
color sobre el color de la marca no se distinguirían del fondo.

No hizo falta tocar ni un renderizador: los colores del sitio son variables
CSS con los canales sueltos, así que redefinirlas en el envoltorio del
capítulo le da la vuelta a todo lo que hay dentro, opacidades incluidas.

En Maison: Tensión negro · Estrategia papel · Identidad papel · Producto negro
· Sistema papel · Implementación papel · Resultados terracota `#EF5530`.

---

## Segunda vuelta: los demás casos

Aplicado con el criterio de Maison a los cinco del CMS.

| | capítulos | separador | cifras | logotipo |
|---|---|---|---|---|
| Merxo | 6 (sin Implementación) | contenedores | retiradas | sin archivo |
| Greenery 420 | **7, completo** | campo de cáñamo | retiradas | sin archivo |
| Solivus | 6 (sin Implementación) | huerto solar | retiradas | sin archivo |
| Mente | 5 (sin Estrategia ni Sistema) | muelle a la hora azul | retiradas | **sí** |
| Nexo Go | 6 (sin Estrategia) | carril bici | **se quedan** | sin archivo |

**No se reordenó nada.** Donde el contenido no da para los siete capítulos se
usan los que hay, en el orden en que están: inventar un capítulo vacío sería
peor que no tenerlo. En Solivus, Identidad cae después de Sistema porque ahí
está su contenido.

**Color de marca.** Solivus, Mente y Nexo Go no tienen lámina de paleta, así
que cerraban en papel en vez de en su color. Se midió sobre sus propias
pantallas, contando píxeles con color de verdad y descartando grises y
extremos: Solivus `#EB4602` (14.300 px, y los tres siguientes también
naranjas), Mente `#4F51FF` (16.200 px), Nexo Go `#C3DB47`, que coincide con
el «verde eléctrico» que dice su propio texto. Va en un campo del documento,
no en una paleta inventada.

**Cifras.** Mismo criterio: solo vale lo que dice algo del mundo, no un
recuento de nuestras decisiones. «5 etapas del pipeline», «3 capas de
jerarquía» o «48 métricas auditadas» se caen. Sobrevive Nexo Go entero
—resolución, radio, latencia, compatibilidad son medidas del producto—; en
los otros cuatro quedaba una sola cifra buena y una cifra sola no es una
barra, así que la barra se retira.

**Logotipo: cuatro de cinco.** No hizo falta volver a Figma — el rótulo del
cliente está dentro de la cabecera de las pantallas que ya teníamos
exportadas. Se recorta esa esquina, se fabrica el canal alfa a partir de la
luminancia, se corta por debajo de un umbral —el fondo del panel de Merxo es
`#EDF1F4`, no blanco puro, y dejaba un velo por todo el rectángulo— y se
vuelve a estirar hasta que el trazo queda opaco.

| | de dónde | panel de material |
|---|---|---|
| Mente | SVG de su sitio | pigmento índigo sobre papel de algodón |
| Merxo | cabecera de su panel | acero de contenedor pintado |
| Solivus | cabecera de su panel | superficie de panel fotovoltaico |
| Greenery 420 | su hero | metal con pintura en polvo |

El color del rótulo sobre cada fondo se decide midiendo: tinta sobre el verde
de Merxo (8,2:1 contra 2,55 del blanco), blanco sobre el naranja de Solivus,
tinta sobre el amarillo de Greenery.

**Nexo Go sigue sin logotipo.** Sus pantallas solo llevan el nombre del
producto como titular, no un rótulo. Y `public/images/projects/nexo-go/logo.png`
**es el símbolo de Nexxo**, no el del cliente: está mal archivado.

**Texturas al pasar por encima**, sí, pero elegidas por el negocio y no por el
nombre del color. En Maison el material salía solo —papel, tinta, tela—; en
Merxo y Greenery los colores son de pantalla, así que el material es el del
sitio donde ese color vive:

| Merxo | Greenery 420 |
|---|---|
| acero corrugado de contenedor | metal con pintura en polvo |
| hormigón pulido de nave | azulejo esmaltado |
| film de paletizar | papel kraft sin blanquear |
| vidrio de seguridad esmerilado | cartulina mate |
| estantería galvanizada | metacrilato colado |
| acero de contenedor con su soldadura | hoja · resina translúcida |

Trece en total, generadas y comprobadas contra el color de su muestra.

**Un fallo que salió aquí:** la hoja de estilo del caso vivía dentro de la
lámina de paleta, de modo que en los casos que no la tienen —Mente, Solivus,
Nexo Go— no se cargaba ninguna de las tres animaciones: ni el velo del
logotipo, ni el acercamiento de la apertura, ni la entrada de las muestras.
Ahora va al nivel de la página.

---

## Por proyecto

| Proyecto | Imágenes | Estado | Qué falta |
|---|---|---|---|
| **Cornish Arquitectos** | 13 web + 5 vídeos | Completo | — |
| **NBL** | 7 web + 3 vídeos | Completo | — |
| **Maison Oliva** | 7 web + 4 vídeos | Casi | Un capítulo sin imagen; dos carritos repetidos |
| **Greenery 420** | 13 web | Casi | Falta la lámina de iconografía (24 SVG listos) |
| **Merxo** | 11 web | Casi | Capturas del panel en vivo; no hay sitio público que grabar |
| **Solivus** | 13 web + 8 de marca | Pendiente | Lo mismo |
| **Nexo Go** | 11 app + 6 de marca | Bloqueado | No tiene web: hay que diseñarla |
| **Mente** | 6 web + 5 de marca | Pendiente | Lo mismo |
| _Tolvia_ | — | Despublicado | Rehacer desde tolvia.com |

## Hecho y verificado

- **Cifras** sustituidas por hechos comprobables en los seis casos del CMS; en producción.
- **Accesibilidad**: alt en las 218 imágenes, nombre en los vídeos, títulos sin duplicar; en producción.
- **Maison Oliva**: retiradas las 9 piezas de marca física. Añadidas paleta y
  tipografía como bloques de datos, con los colores medidos sobre
  maison-oliva.com y las fuentes leídas de su CSS. Tres secciones de solo
  texto. Cuatro grabaciones del sitio real.
- **Greenery**: retiradas las 8 piezas generadas. Paleta y tipografía con los
  valores leídos del propio archivo de Figma —Obviously Black y Hanken Grotesk,
  `#FDC433`, `#008A7C`, `#0C0E1E`, `#FF408D`, `#9966EB`—. Cuatro pantallas
  reales de la tienda. Narrativa reescrita: el texto describía una marca
  botánica sobria que no existe.
- **Merxo**: retiradas las 4 piezas de marca física —rótulo, vía pública,
  acreditación y merchandising—. Paleta y tipografía con los valores leídos de
  su archivo de Figma: Plus Jakarta Sans, `#0B0C13`, `#EDF1F4`, `#F4FBFD`,
  `#E0E7ED`, `#23B976`. Añadido el panel de escritorio y las dos pantallas de
  móvil, montados en ventana y en teléfono. Corregido el párrafo que decía
  «azul comercial como color base»: en el sistema real no hay azul.
- **Maison Oliva, segunda vuelta.** Las cuatro grabaciones iban en crudo —el
  rectángulo de la captura, sin marco— mientras Cornish y NBL van montadas en
  ventana y en teléfono sobre plató. Ahora las cuatro van enmarcadas, cuadradas
  y sobre el mismo plató. El montaje se hace con dos láminas y ffmpeg: el plató
  debajo, el vídeo en medio y el aparato encima con la pantalla agujereada.
  Además:
  · el vídeo del menú se volvió a grabar. El pie decía «el menú se abre sobre
    la colección» y estaba grabado en la home sin llegar a enseñarlo: el
    selector compuesto resolvía en orden del DOM y el clic caía en otro sitio.
  · la pieza de la izquierda pasó de la colección de guantes a la de vestidos,
    porque el vídeo del menú tiene los guantes de fondo y las dos se leían
    como la misma imagen repetida.
  · los tres renders de escenografía del capítulo móvil salen y entran tres
    capturas reales del teléfono —colección, filtros y menú—. Dos de aquellos
    renders además mentían: «PDP móvil» sobre un portátil y «Carrito móvil»
    sobre un monitor de escritorio.
- **Los pies de foto, reescritos.** Describían la interfaz —«galería, color,
  talla y precio en un solo scroll»—, que es una lista de campos, no una
  historia. Medido contra la referencia de Cakao: allí los pies tienen de tres
  a ocho palabras, hablan en la voz de la marca, y el razonamiento vive en los
  bloques de texto. Los once de Maison siguen ya ese criterio. **Falta hacer lo
  mismo en los otros siete casos.**
- **La escala de lectura.** El cuerpo de los casos estaba en 16 px; el de la
  referencia ronda los 28. A ese tamaño, un párrafo colocado entre dos piezas
  de 1.500 px se lee como un pie de foto y el caso deja de contarse. El
  componente de texto tiene ahora dos escalas —`lectura` para el journal y la
  tienda, `caso` para los proyectos— y el caso usa la suya: **cuerpo 28 px y
  titular 50 px en escritorio**, 18 y 26 en móvil. Los rótulos pequeños pasan
  de 9 a 11 px.
- **Fuera los pies de foto.** Once textos de dos líneas bajo cada imagen que
  nadie iba a leer y que partían el relato en trozos sueltos. El texto sigue
  guardado en el CMS porque es lo que da nombre accesible a cada pieza
  —`mediaAlt(caption, title)`—, pero deja de dibujarse. La historia vive ahora
  en los capítulos, como en la referencia.
- **La paleta, rehecha.** Muestras cuadradas y grandes, con nombre, HEX y RGB
  dentro de cada una, y la nota al pasar por encima. Entran escalonadas al
  aparecer, con `animation-timeline: view()`: sin una línea de JavaScript,
  guardado tras `@supports` y desactivado para quien haya pedido menos
  movimiento.
- **La lámina tipográfica, rehecha.** Cada familia enseña una «Aa» enorme en su
  propia letra, que al pasar el puntero se abre y gana peso. Debajo, la
  escalera de tamaños, el alfabeto y la nota.
- **El capítulo de apertura, ensanchado.** El bloque sin titular llevaba
  `max-w-[86ch]`, y `ch` se resuelve contra el tamaño del contenedor —16 px—,
  no contra el del párrafo. Al subir el cuerpo a 28 px la medida se quedó
  clavada en unos 690 px: siete líneas estrechas con media página en negro al
  lado. Ahora la medida va en `rem` y el texto se reparte en dos columnas de
  616 px dentro de 1.312, salvo cuando el capítulo trae un solo párrafo —le
  pasa a «Impacto» de Mente—, que entonces va a una columna de 832 px.
  El rótulo suelto se dibuja como título de capítulo, por debajo del titular
  de sección para que la jerarquía aguante cuando caen seguidos.
- **Bloques nuevos en código**: `palette`, `typography`, `statement`, y cuatro
  repartos para `splitShow` (`pair`, `strip2`, `grid4`, `bleed`).
- **Diagramación**: el cuerpo de texto ensanchado en todos los casos; el rótulo
  sin titular ya no se pierde; una pieza suelta ya no ocupa media página.
- **Proporciones**: sólo había dos huecos —cuadrado y retrato— y la pieza se
  recortaba para entrar en el que le tocara. Eso le cortaba la cabeza a la
  modelo en la portada de Maison (una composición de 1,31 metida en un 16/9) y
  en la grabación de la home móvil (0,46 en un 0,78), y le quitaba la columna
  derecha a la grabación de la ficha (1,60 en un cuadrado). Ahora el hueco
  toma la proporción real del archivo: las imágenes la traen medida en los
  metadatos del asset y los vídeos la llevan escrita en el documento, sondeada
  con ffprobe. Fuera de la banda 0,62–1,78 el hueco se queda en el extremo y
  la pieza pasa a `contain`, de modo que se ve entera.
- **El reparto `pair` dibujaba cada pieza dos veces**: un árbol `hidden md:grid`
  y otro `md:hidden`. Cada imagen se pedía por duplicado y cada vídeo se
  reproducía por duplicado, uno de ellos dentro de un contenedor invisible.
  Ahora hay un solo árbol: las columnas van en `display: contents` y en móvil
  `order` devuelve el orden original.
- **Dos piezas de escritorio de Maison** iban una debajo de otra, cada una a lo
  ancho de la página. Ahora van en fila de dos columnas.
- **El espécimen tipográfico** se dibujaba siempre a dos columnas; con una sola
  familia —Merxo— dejaba media sección vacía. Ahora el nombre y la escalera de
  tamaños se reparten el ancho.
- **Mobile-first de Maison tenía cinco piezas** y la quinta se quedaba sola con
  medio folio en negro al lado. Retirada: era un render de escenografía cuyo
  pie prometía «tres pantallas del mismo scroll» y enseñaba un solo teléfono.
  Ningún capítulo de pareja queda ya con número impar.

## Pantallas creadas en Figma

**Tres, para Merxo.** Archivo propio en el equipo FREELANCE:
`Merxo — pantallas de móvil (caso Nexxo)`.

| pantalla | qué enseña |
|---|---|
| Pipeline | las cinco etapas con su recuento y la próxima acción |
| Clientes | cartera por valor del mes y los que llevan tiempo sin contacto |
| Workflows | el editor de reglas —si / y / entonces— y las que corren ahora |

No son decoración: están dibujadas con el sistema real del proyecto —Plus
Jakarta Sans en Regular, Medium y SemiBold, y las siete variables de color
`#0B0C13 · #EDF1F4 · #FFFFFF · #F4FBFD · #E0E7ED · #23B976 · #303238`— creadas
como colección de variables en el propio archivo.

Se hicieron porque el capítulo de Tensión necesitaba una pieza y reutilizar
las pantallas de otros capítulos habría repetido la misma imagen dos veces en
el mismo caso. Van montadas en tres teléfonos sobre la nave de noche.

Lo demás que se ha hecho con Figma sigue siendo lectura: exportaciones a
resolución completa y lectura de estilos de Greenery, Merxo, Nexo Go y
Solivus.

## El escenario de Merxo, por capas

El capítulo de Tensión ya no es una imagen plana con los tres teléfonos
colocados. Es un bloque nuevo —`escenario`— con cuatro piezas: la nave de
fondo y cada aparato por separado, con su fondo transparente y su sombra ya
puesta.

Eso permite contarlo en orden. Al llegar la sección hay un solo panel; al
seguir bajando, los otros dos salen de detrás, uno a cada lado, mientras el
central cede un punto de tamaño. Va con `animation-timeline`, sin una línea
de JavaScript, y el estado de base —lo que ve quien no admita líneas de
tiempo o haya pedido menos movimiento— es la escena ya abierta.

El tramo termina en `cover 48%`, que es justo cuando el escenario llena la
pantalla. Con el 60% la escena acababa de abrirse cuando ya se iba por
arriba, y el gesto no se veía entero nunca.

Dos trampas que costaron una vuelta cada una:

- Las pantallas del panel llevaban `z-index` dentro de un contenedor con
  `position: relative` y sin `z-index` propio. Eso no crea contexto de
  apilado, así que subían al contexto raíz y tapaban el puntero del vídeo.
  Se arregla con `isolation: isolate`.
- La pieza se servía a 1.800 píxeles para un hueco que a sangre ocupa la
  pantalla entera: en una retina de 1440 eso son cerca de 3.000 píxeles
  reales, y se veía estirada. Ahora la proyección pide 2.600 cuando el bloque
  es `bleed`, y la composición se genera a 3.840.

## El separador del patio, en movimiento

El patio de contenedores llevaba encima una fotografía fija. Ahora lleva el
panel de escritorio funcionando: el puntero va a una pestaña, la pulsa y la
vista cambia —inicio, informes, clientes—, quince segundos en bucle.

Las tres vistas son clones del panel real del archivo, con el contenido
reescrito y la pestaña activa movida al apartado que toca. El vídeo se dibuja
fotograma a fotograma en lugar de dejar correr una animación CSS: el
navegador sin cabeza no garantiza en qué instante captura, y una transición a
medias se nota enseguida.

## NBL y Cornish, al redil

Los dos casos vivían solo en `sanity/mock/projects.ts`, con capítulos propios
y sin bloques de identidad. Ahora están en el CMS con la espina de siete
—Tensión, Estrategia, Identidad, Producto, Sistema, Implementación,
Resultados—, logotipo, paleta con texturas y tipografía.

Lo que no se inventó: **la tipografía y el color salen de los repositorios de
los propios sitios**, que están abiertos en la sesión.

- NBL usa **Archivo** variable de Google Fonts, y usa los dos ejes: el cuerpo
  en anchura normal y la palabra grande de cada producto a 118 % de ancho,
  peso 700, interlineado 0,85. Está en `src/styles/global.css`, regla
  `.word`. Los colores salen de `tokens.css`, incluidos los cuatro de aroma
  —sándalo, vainilla, menta y cielo—, que son de producto y no de marca.
- Cornish usa **Afacad** vía `next/font/google`, y su `@theme` en
  `globals.css` lleva anotadas dos revisiones de contraste: el gris de las
  etiquetas bajó de `#8C867B` a `#767167` para llegar a 4,5:1, y el oliva de
  las superficies con texto blanco se hundió a `#6F7652` para 4,8:1. Eso está
  contado en el texto de la paleta porque es exactamente el tipo de dato que
  distingue un caso real de una lámina bonita.

Las pantallas de móvil de NBL se volvieron a capturar de la tienda construida
y servida en local, a 390×844 con densidad 3. Las que había venían ya montadas
sobre crema, con la pantalla a 351 píxeles: meterlas en un teléfono habría
significado ampliarlas al doble. De paso apareció que `dist/` estaba sin
reconstruir y el catálogo salía con las cinco categorías partidas en 3 + 2; el
deslizador de una sola fila ya estaba escrito en el código desde antes.

**Cornish lleva el crédito donde se ve.** El diseño es de Cakao Studio: lo
dice el primer párrafo del capítulo de Identidad, con su enlace, y lo repite
el pie del bloque de logotipo. El caso cuenta la construcción, que es lo que
fue nuestro.

El `liveUrl` pasa a `cornisharquitectos.com`, comprobado: responde y sirve el
sitio del despacho. Apuntaba al dominio de Vercel.

La barra de cifras de Cornish se retira entera —«13 rutas» y «4 hitos» cuentan
decisiones nuestras, no hechos del despacho— y los dos datos que sí dicen algo
pasan a la prosa de Resultados. En NBL se queda con tres.

## Tres arreglos que salieron de estos dos casos

- **El rótulo se pintaba siempre en tinta.** El panel de logotipo no tiene
  fondo propio: enseña el del capítulo. En cuanto un caso empieza con un
  resumen antes del primer capítulo, el compás se desplaza y la identidad cae
  en tono oscuro — y el rótulo quedaba negro sobre negro. Ahora el capítulo
  pasa su tono al bloque y el rótulo lo sigue. Comprobado en los siete casos
  que tienen logotipo.
- **La X del modal desaparecía.** Estaba en `z-10`, igual que las secciones
  del caso, que van después en el documento: con el mismo índice gana el
  último. Sube a `z-30`.
- **Las miniaturas del índice eran un degradado.** La consulta de la lista
  nunca pedía el rótulo del cliente, que vive dentro del capítulo de
  Identidad. Ahora lo pide y lo dibuja. Nexo Go sigue sin el suyo: el PNG que
  hay en el repositorio es la marca de Nexxo, no la del cliente.

## Greenery: fuera los bodegones, dentro el diseño real

Tres de las cuatro piezas del bloque `ss2` no eran pantallas: eran bodegones
de marca —un dormitorio con el estuche «SLEEP», una placa de Petri, una tabla
con hachís— y sus pies prometían pantallas que la imagen no enseñaba. La
cuarta, la home en vertical, ya salía en el bloque de arriba.

En su lugar entran dos piezas del archivo de diseño del cliente
(`XaL4fIg4CbKtbU9huaOPi2`, página «Diseño Greenery»), que no estaban usadas en
ninguna parte del caso:

- **«Sobre nosotros» en escritorio**, en ventana de navegador sobre crema.
- **«Sobre nosotros» en móvil**, dos teléfonos: el encabezado y el tramo con
  las cifras del negocio y los cuatro pilares.

Y el capítulo de **Sistema**, que hablaba de un sistema sin enseñarlo, pasa a
llevar las dos láminas que sí lo son: **005 UI DETAILS** —el carrito, el
acordeón que responde la duda legal, los avisos de pedido, el pago— y **006
ICONS**, los veinticuatro iconos con el mismo grosor de trazo.

Las composiciones se montan sobre crema `#FCF2DF`, que es el papel de la
tienda, para que las seis piezas del capítulo se lean como una serie.

**Lo que no se usó, y por qué.** La lámina `Frame 2085660882` de ese mismo
archivo es una presentación de Behance con «83 % satisfacción, +42 %
engagement, +75 % shopping growth» y un testimonio firmado por un «James
Carter, 29». Son cifras y una persona inventadas para una maqueta. Es
exactamente lo que se retiró de los otros casos, así que se queda fuera.

## Nexo Go, rehecho con sus pantallas reales

El caso enseñaba render generado de principio a fin: la estación de bicis, el
despiece del rastreador, la caja abierta, la flota numerada en vinilo, el
ciclista al atardecer y varias manos sosteniendo un teléfono. Fuera las
dieciocho piezas.

Lo que entra sale del archivo de diseño del proyecto, página «proyectos» de
`OI7TsdkFhEoPUFJ7NatDoI`: tres pantallas reales —inicio, ficha de la bici y
mapa— clonadas en cinco más (zona segura, alerta, luces y bloqueo, batería e
historial), ocho en total y ninguna repetida entre capítulos.

La ciclovía se conserva, pero deja de ser una postal: es el fondo del
escenario de Tensión, con tres aparatos saliendo de detrás al bajar.

**Dos correcciones de fondo, no de forma.**

El capítulo de Identidad decía «verde eléctrico `#00D97E`», «Clash Display
para el branding», «SF Pro para la interfaz» y describía «una N estilizada»
como logotipo. Nada de eso está en ningún archivo. El propio tablero del
proyecto documenta el sistema: `#F1F1F1`, `#13121B`, `#E7FF5E`, y **Plus
Jakarta Sans** en SemiBold y Medium —comprobado leyendo las fuentes de las
tres pantallas—. El capítulo se reescribió contra eso.

Y **no hay logotipo del cliente en ninguna parte**, así que el caso no lleva
bloque de logotipo. El único «NEXO GO» que existía era un render generado del
rótulo. El resumen del proyecto decía «diseñé la app móvil y la identidad»;
ahora dice «la app móvil y su sistema visual», que es lo que se puede
enseñar.

Las dos superficies del sistema se usan como fondo de las propias piezas: las
pantallas claras descansan sobre `#F1F1F1` y las oscuras sobre `#13121B`.

## Nexo Go, segunda vuelta: tipografía propia y tres pantallas nuevas

Dos parejas eran casi la misma imagen. La ficha de la bici y la de batería
compartían fotografía y maquetación; la zona segura y la alerta eran el mismo
mapa con otras etiquetas. Las dos repetidas se retiran.

Entran **tres pantallas diseñadas desde cero** con el sistema del proyecto,
siguiendo las referencias que pasó la dirección:

- **Estación de carga** — mapa con estaciones, buscador, nivel de batería y
  ficha de la estación con distancia y precio por kWh.
- **Registro de seguridad** — el aviso vivo con sus dos acciones arriba y, en
  línea de tiempo, todo lo que pasó mientras no estabas. No es un mapa, que
  era el problema.
- **Onboarding** — la primera pantalla: tres promesas concretas y ningún
  permiso pedido todavía.

La de onboarding se resolvió con tipografía y un resplandor de lima en lugar
de una fotografía de fondo: la única imagen de bicicleta disponible en el
archivo es un render generado, y meterlo a pantalla completa habría devuelto
por la puerta de atrás lo que acabábamos de sacar.

**La tipografía deja de ser Plus Jakarta Sans.** Merxo ya la usa, así que dos
casos sonaban igual. Pasa a **Outfit**: misma construcción geométrica y
métricas parecidas, de modo que las nueve pantallas se recompusieron sin
descuadrarse. El cambio se hizo sobre los propios marcos de Figma y se volvió
a exportar todo, para que lo que dice el bloque de tipografía sea lo que se ve
en las pantallas.

Las parejas usan ahora las dos superficies del sistema como fondo: una pieza
clara junto a una oscura no es un descuido, es la división que ordena la
aplicación.

## Nexo Go, tercera vuelta: calidad al nivel de las pantallas reales

Las tres pantallas nuevas estaban dibujadas a mano, y al lado de las reales se
notaba: las calles del mapa eran barras grises y los iconos, glifos de texto.

- **Estación de carga** se rehízo **clonando el mapa real** (`457:235`), de
  modo que hereda su cartografía, su barra de estado, su botón de atrás y sus
  fichas blancas. Solo cambian el contenido y los puntos: tres círculos de
  lima con el rayo de **Heroicons**. Los círculos traían la bicicleta como
  segunda capa de relleno; había que quitarla, no taparla.
- **Registro de seguridad** recupera la barra de estado y el botón de atrás
  reales, y el punto verde de la píldora pasa a ser un escudo de Heroicons.
- **Onboarding** pasa a llevar fotografía de verdad: un ciclista urbano a hora
  azul generado con **Higgsfield** (`cinematic_studio_2_5`, 2k), con un velo
  de abajo arriba para que el texto se lea. El texto secundario sube de gris
  apagado a papel al 86 %: sobre fotografía, lo que funcionaba en plano se
  queda corto.

La imagen entró por `upload_assets` apuntando a un rectángulo ya creado:
`createImageAsync` no está disponible en este entorno y pasar los bytes en
base64 dentro del script no cabe en el límite de 50.000 caracteres.

## Una familia, una ficha

Tres casos enseñaban la misma tipografía dos veces, una ficha por papel: Nexo
Go con Outfit, Cornish con Afacad y NBL con Archivo. Dos láminas idénticas
una al lado de la otra no cuentan que haya dos tipos — cuentan que la lámina
se repite.

Ahora cada uno lleva una sola ficha con el papel en plural y la nota
fundida, que es como lo hacía Merxo desde el principio. Maison y Greenery se
quedan con dos porque de verdad usan dos familias distintas.

## Nexo Go, cuarta vuelta: negro, fotografía y una pantalla menos repetida

- **Los fondos oscuros tiraban a azul.** El sistema documenta `#13121B`, pero
  en la página se leía como azul marino. Los fondos de las piezas y de las dos
  pantallas inventadas bajan a **`#060606`**, que es lo que pidió la
  dirección. *La lámina de paleta sigue documentando `#13121B`, que es el
  valor del tablero del cliente: si se quiere alinear, hay que cambiarla a
  mano.*
- **El historial repetía la tarjeta del inicio** —misma fotografía de la bici,
  misma maqueta—. Se retira y entra **«Saved routes»**: dos tarjetas con
  fotografía de la ruta, distancia, duración y nivel, con los puntos de
  paginación a la izquierda, como la referencia de Revo.
- **La ficha de la estación de carga enseña el sitio.** Antes eran dos datos
  sueltos heredados del mapa; ahora es una tarjeta con la fotografía de la
  estación, el nombre, la dirección y dos píldoras.
- **La fotografía del tutorial se rehízo**: ciclista aislado sobre negro, sin
  ciudad ni suelo ni horizonte, con desenfoque de movimiento. La anterior
  tenía demasiado fondo y competía con el texto.
- **Los botones del tutorial bajan de tamaño**: la flecha de 84 a 64, la
  pastilla de 250×56 a 210×52.

Las cuatro fotografías salen de **Higgsfield** (`cinematic_studio_2_5`, 2k) y
entran en Figma por `upload_assets` sobre rectángulos ya creados, que es la
única vía disponible aquí.

## El ciclista del tutorial: estela y duotono

La fotografía del onboarding pasa por dos tratamientos propios, en
`nexo-duotono.mjs`:

1. **La estela de velocidad.** `sharp` no tiene desenfoque direccional, así
   que se compone a mano: dieciséis copias desplazadas en horizontal con la
   opacidad cayendo, mezcladas al 72 % sobre el original para que la bicicleta
   no se deshaga del todo.
2. **El duotono de marca.** De la luminancia se interpola entre `#060606` y el
   lima `#E7FF5E`. La clave está en normalizar antes y subir la gamma a 2,3:
   sin normalizar, la fotografía es tan oscura que el lima sale verde oliva
   sucio; con gamma baja, la imagen entera se vuelve verde y deja de ser una
   fotografía. Con 2,3 el lima queda solo donde hay luz de canto, que es el
   efecto que se buscaba.

Hecho esto, el velo del degradado se suavizó —de 0,96 a 0,90 arriba y de 0,60
a 0,34 en el medio—, porque sobre una imagen ya casi negra se estaba comiendo
la estela.

Los dos botones del tutorial miden ahora lo mismo de alto, 52: el círculo iba
a 64 y se veía desparejado al lado de la pastilla.

**La pantalla de rutas la ajustó la dirección en Figma** —cambió mi círculo de
perfil por una píldora «Routes» con icono, que es el lenguaje del resto de la
aplicación— y se reexportó tal cual.

## Pendiente de esquema

Los campos nuevos —`escenario`, `logo`, `credito`, `ratio`, `textura`,
`colorMarca`, el tamaño `bleed`— viven en el conjunto de datos y los lee la
proyección, pero no están declarados en `sanity/schemas/project.ts`. El sitio
los pinta bien; el Studio los enseña como campos desconocidos. Conviene
declararlos antes de que alguien edite un caso desde ahí.

## Bloqueos

- **Nexo Go** no tiene sitio web. Su caso se apoya hoy en fotografía de producto
  generada. Requiere diseñar landing y panel web en Figma.
- **Tolvia** conserva cifras inventadas en el repositorio; está despublicado y
  su URL devuelve 404, así que nada falso está publicado.
- El `liveUrl` de Cornish apunta al dominio de Vercel; el real es
  `cornisharquitectos.com`.

## Las esquinas redondeadas que venían dentro del archivo

Veintiséis piezas se habían exportado con las esquinas ya recortadas y
transparentes. Cada archivo traía su propio radio —7, 9 y 14 píxeles— y cada
uno se muestra a una escala distinta, así que en pantalla convivían tres
redondeos diferentes con los 20 píxeles del contenedor. El marco no podía
arreglarlo: donde el archivo es transparente no hay nada que redondear.

Se han devuelto a su forma de rectángulo rellenando cada fila con el color del
primer píxel opaco que tiene al lado, que en un recorte de esquina es justo el
que habría ahí si no la hubieran recortado. Los rellenos van del 0,03 % al
0,48 % de la superficie: solo las esquinas. El redondeo lo pone ahora el
contenedor, una sola vez y el mismo para todas.

Reparto: 13 de Mente, 7 de Solivus, 4 de Merxo, 1 de Greenery y 1 de Maison
Oliva. Comprobación posterior sobre las 76 piezas del CMS: ninguna conserva la
esquina recortada.

Una pieza de Mente da positivo en la comprobación y no lo es: tiene dos filas
enteras transparentes —un borde de un píxel— pero en (0,8) ya es opaca, de modo
que no hay radio que quitar.

## Paleta y tipografía de Mente y Solivus

Mente sale de su propio sitio en producción: **Museo Sans** en los siete pesos
que usa, y los colores calculados de cada elemento —`#4F50FF`, `#080B47`,
`#CCFF66`, `#333333`, `#69727D`, blanco.

Solivus sale del archivo de diseño del proyecto: **Gilroy**, Regular y SemiBold,
las dos únicas familias en sesenta y cuatro textos. La paleta del panel es
`#EB4602` de marca, `#FB7C13` de acento, `#01B859` en marcha, `#B8014A` avería,
y la rampa `#0A090C`, `#232328`, `#ABABAB`, `#F7F7F7`. El naranja de marca
coincide con el tono que domina sus capturas, contado píxel a píxel.

## El esquema de Sanity, al día

Cinco bloques llevaban meses publicados sin estar declarados —`statement`,
`logo`, `palette`, `typography` y `escenario`—, más el reparto de `splitShow`,
el color de marca del proyecto y tres campos sueltos de Media: `credito`,
`ratio` y el tamaño `bleed`. La vista los pintaba y la proyección los pedía,
pero el Studio los veía como campos desconocidos: nadie podía editar un caso
desde ahí sin arriesgarse a perderlos al guardar.

Declararlos destapó además dos cosas que no se veían:

- `heroMedia` estaba declarado como URL absoluta, y las dos que existen son
  rutas del propio sitio (`/images/projects/nbl/hero.mp4`). El Studio daba por
  inválidos los casos de NBL y Cornish y no dejaba guardarlos. Ahora admite
  ruta relativa.
- `automationState` no estaba declarado. Lo escriben la ruta de YouTube y el
  webhook de Lemon Squeezy; el segundo guarda ahí los identificadores de los
  pedidos ya procesados, que es lo que evita procesar dos veces el mismo
  cuando la entrega se repite. Queda declarado y en solo lectura.

Validación de los documentos contra el esquema: **32 válidos, 0 errores**.
Quedan tres avisos de datos que nadie lee —`publishedAt` en NBL y Cornish, que
es un campo de los artículos, y `story_en` en Mente— y no se tocan sin
decidirlo antes.

## El orden de Nosotros

La consulta ordenaba por `orderRank`, un campo que no existe en el esquema.
GROQ lo resolvía como nulo para todos los proyectos, de modo que el orden lo
acababa decidiendo el desempate, `_createdAt desc`: lo que salía no eran los
dos casos elegidos sino los dos últimos creados. Ahora ordena por `order`,
igual que el índice y el enlace al siguiente caso. Salen Solivus y Merxo, que
son el 1 y el 2.
