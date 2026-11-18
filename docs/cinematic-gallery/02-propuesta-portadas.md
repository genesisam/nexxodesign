# Portadas — propuesta para revisar

Qué construir antes de montar la primera portada. Nada de esto está hecho todavía.

Fecha: 17 de noviembre de 2026

---

## El sistema

Tres capas por portada, siempre las mismas:

| Capa | Qué es | Cómo se hace |
|---|---|---|
| **Fondo** | Una fotografía de escenario, muy desenfocada y oscurecida. Atmósfera, nunca contenido. | Higgsfield, 16:9, 4K |
| **Piezas** | Dos objetos de ladrillo, distintos en cada proyecto, que cuentan de qué va el caso. | Blender, render propio |
| **Pantalla** | La captura real del proyecto dentro de una ventana de navegador. | Playwright o export de Figma |

### Lo que ya está decidido por el estudio 3D

La escena de `/nosotros` fija el taller, y las piezas nuevas tienen que vivir en él. Del manifiesto (`public/3d/nexxo_manifest.json`):

- **Unidad**: 1 stud = 0,08 m, glTF Y-up. Todo se mide en studs, no a ojo.
- **Paleta**: `ivory #EEE9DF` · `sand #C1B7AA` · `warm_grey #79716E` · `graphite #201F22` · `violet #A694E8`.
- **Luz**: clave 170 W en (1, 0.86, 0.7), relleno 35, contra 320, mundo 2.5. Cycles.

Las piezas de las portadas usan esa paleta y ese rig. El color de cada marca entra solo como un acento en **una** pieza — nunca repintando el objeto entero, que rompería la familia.

### Por qué Blender y no Higgsfield

Blender 4.2 y 5.2 están instalados. Cada pieza es un bucle de Python que coloca ladrillos sobre la rejilla de studs y renderiza con el mismo rig: `blender -b -P pieza.py`. Sin abrir la interfaz, sin modelar a mano. Y lo más importante: la pieza queda **en el repositorio como modelo**, reutilizable y modificable, no como un PNG que hay que volver a pedir cada vez.

**Regla de construcción**: solo ladrillos rectos, placas y redondos de la biblioteca estándar. Si una pieza necesita una forma que no sale de apilar, está mal elegida.

---

## Las piezas, proyecto por proyecto

Dos por caso. La primera dice **qué es el producto**; la segunda, **qué problema resuelve**.

### Solivus — monitoreo solar
1. **Panel solar inclinado** — placa de 8×6 en graphite con líneas ivory, sobre dos patas de 2 ladrillos. Cuatro piezas en total.
2. **Baliza de alerta** — columna 2×2 en graphite rematada con un redondo 1×1 translúcido naranja. Es el sistema de alertas, que es lo que de verdad rediseñaste.

*Fondo*: campo de paneles al atardecer, horizonte cálido, desenfoque fuerte.

### Merxo — CRM comercial
1. **Escalera de cinco peldaños** — cinco ladrillos 2×4 en ascenso, el último en verde. Es, literalmente, el pipeline de cinco etapas.
2. **Palé de inventario** — placa 6×6 con tres cubos 2×2 apilados y uno volcado: el stock en riesgo que el sistema avisa antes de prometer lo que no hay.

*Fondo*: pasillo de almacén en hora azul, luces de estantería desenfocadas.

### Nexo Go — app para bicicleta eléctrica
1. **Pin de ubicación** — columna 2×2 redonda en graphite con cono 1×1 lima. El geofencing de ±5 m en un objeto.
2. **Rueda** — aro de ocho segmentos en graphite con un segmento lima. La bici, sin dibujar la bici.

*Fondo*: asfalto mojado de ciudad de noche, reflejos lima muy difusos.

### Greenery 420 — tienda CBD
1. **Maceta con brote** — tiesto 2×2, tallo de redondos 1×1 y dos placas 1×2 de hoja. El cáñamo sin caricatura.
2. **Frasco** — cilindro de redondos 2×2 con tapa de teja, en ámbar translúcido. El aceite, que es su línea madre.

*Fondo*: invernadero con luz de mediodía atravesando el vidrio, ámbar, muy desenfocado.

### Maison Oliva — alta costura
1. **Perchero** — barra 1×8 sobre dos columnas, con dos placas 1×2 colgando. La pieza, antes de la foto.
2. **Peana escalonada** — tres placas (6×6, 4×4, 2×2) en ivory. La tienda como galería, que es la tesis del caso.

*Fondo*: atelier de piedra mediterránea, luz lateral, hueso.

### Mente — fintech de factoring
1. **Pila de monedas** — redondos 2×2 ligeramente abanicados, uno en violet. La liquidez anticipada.
2. **Flecha ascendente** — cinco ladrillos en diagonal más dos de punta, en violet. Crecimiento, sin gráficos falsos.

*Fondo*: fachada de vidrio de oficina en hora azul, azul profundo.

### NBL — cuidado de barba
1. **Bote de producto** — columna de redondos 2×2 en graphite con banda ivory y tapa de teja. Los cinco productos empiezan aquí.
2. **Peine** — placa 1×6 con seis redondos 1×1 colgando. Reconocible al instante, tres minutos de construcción.

*Fondo*: barbería de azulejo oscuro, tungsteno cálido.

### Cornish Arquitectos — estudio de arquitectura
1. **Voladizo** — dos placas ivory desplazadas sobre una columna graphite. Es el edificio de su propia portada.
2. **Escalera de hormigón** — placas 2×4 escalonadas en sand. La escalera que sale en su héroe.

*Fondo*: muro de hormigón encofrado con sombra de árbol, gris frío.

---

## Lo que hay que decidir mañana

1. **¿Dos piezas por portada o una?** Dos dan juego de profundidad —una delante mordiendo la esquina, otra detrás medio oculta— pero en cuadrado aprietan. Mi recomendación: dos en 16:9, una en cuadrado.
2. **¿El fondo lleva el color de la marca o se queda neutro?** Un invernadero ámbar detrás de Greenery es bonito, pero ocho fondos de colores distintos deshacen la familia que acabamos de conseguir. Mi recomendación: fondos casi monocromos, oscurecidos al 70 %, y que el color de marca entre solo por el halo y por el acento de una pieza.
3. **¿Las piezas se reutilizan entre proyectos?** Propongo que no: dieciséis piezas, una biblioteca. Pero un pedestal o un palé podrían servir dos veces si el presupuesto de tiempo aprieta.

## Lo que necesito

- Luz verde a la lista de piezas, o los cambios que quieras.
- Confirmación de que los fondos los genero con Higgsfield (las piezas, no — esas van en Blender, como pediste).

Con eso montamos Merxo entera como primera portada y, si funciona, el resto sale del mismo molde.
