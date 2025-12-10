# Fase 1.1a): Análisis del sector
## Clasificación de empresas del sector  
El sector es "Board Game Tracking & Scoring Tools" (Herramientas de registro y puntuación de juegos de mesa). El mercado está dominado por aplicaciones móviles que intentan reemplazar la hoja de papel y el lápiz, integrándose casi siempre con la base de datos de BoardGameGeek (BGG).

Hemos seleccionado 5 competidores clave que representan las diferentes amenazas para nuestro proyecto: Board Game Stats (BG Stats) es el líder indiscutible (Países Bajos), B2C Pago único + DLCs (IAP), global, la herramienta "estándar" para usuarios avanzados. ScorePal, competidor veterano en Android, B2C Freemium, global, enfocado en la lógica de puntuación y "hojas de puntuación inteligentes". BGG Catalog, soluciones ligeras/open source, B2C Gratuito, global, gestores de colección sencillos vinculados directamente a la cuenta de BGG. Board Record (Boardlog), Startup Indie, B2C Freemium, global, enfocado en visualización de datos y personalización extrema. BoardGameGeek (BGG) (El "Notion" del sector), La gran plataforma, B2B/B2C Gratuito con publicidad, global, la base de datos de origen de todo el hobby.

## Análisis de características organizativas  
**--- Board Game Stats (BG Stats) ---**  
Es el "World Anvil" de este sector. Un proyecto personal de un desarrollador (Eerko Visscher) que se ha convertido en el estándar de oro. Muy profesional y pulido.

Empleados: < 5 (Principalmente el fundador y soporte comunitario).

Tecnología: Desarrollo Nativo (iOS y Android optimizados por separado), Sincronización propia en la nube y API de BGG.

**--- ScorePal ---**  
Aplicación veterana que nació para resolver la complejidad de sumar puntos en juegos difíciles (ej. Agrícola). Desarrollo más lento en los últimos años.

Empleados: 1-2 (Indie Dev).

Tecnología: Android nativo (Java/Kotlin). Fuerte enfoque en bases de datos locales y scripts lógicos para calcular puntos.

**--- Board Record (Boardlog) ---**  
El competidor moderno y flexible. Se posiciona como la alternativa potente para usuarios que quieren "masticar" datos.

Empleados: < 5 (Indie Hacker).

Tecnología: Android, enfoque modular donde el usuario puede definir qué datos ver.

**--- BoardGameGeek (La Plataforma) ---**  
Es la gran corporación (adquirida recientemente por grandes grupos de inversión, aunque mantiene gestión comunitaria).

Amenaza: No es una app nativa perfecta, pero su web es el lugar donde residen los datos reales. Si BGG lanzara una app oficial moderna y perfecta, mataría al resto del sector.

### Tabla comparativa de competidores
| Empresa        | Modelo de Ingresos                                   | Puntos Fuertes                                                                 | Puntos Débiles                                                                 | Stack Tecnológico (Est.)              |
|----------------|------------------------------------------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------------|---------------------------------------|
| BG Stats       | Pago App + DLCs (Suscripción Cloud opcional)         | UX extremadamente pulida. Importación/Exportación a BGG impecable. Soporte constante. | Modelo de cobro fragmentado (pagas por la app, y luego por las "Deep Stats").   | Swift (iOS), Java/Kotlin (Android)    |
| ScorePal       | Freemium (Pro Key)                                   | Asistentes de puntuación paso a paso (no solo sumas, sino lógica de juego).     | Interfaz visualmente desactualizada. Curva de aprendizaje para crear plantillas. | Android Nativo                        |
| Board Record   | Freemium                                             | Visualización de datos superior (gráficos, tartas). Muy personalizable.         | Puede abrumar al usuario casual. Menos enfoque en la "belleza" de la interfaz.  | Android / Flutter o similar           |
| BGG Catalog    | Gratuito / Donación                                  | Simple y directo. Ideal para solo ver qué juegos tienes.                        | Muy limitado en el registro de partidas (Logging). A menudo son solo visores web. | Híbrido / Web Wrappers                |
| BoardGameGeek  | Publicidad / Donaciones                              | La base de datos infinita. Comunidad masiva.                                   | UX/UI de los años 2000. Lento en móviles. Requiere conexión.                     | PHP (Legacy), MySQL                   |

### Análisis del Producto
Propuesta de Valor Única:

**BG Stats:** "Cuantifica tu hobby". Ofrece la experiencia más profesional y estable, tratando el juego de mesa como un deporte con estadísticas serias.

**ScorePal:** "Olvídate de las matemáticas". Su valor no es solo guardar el resultado, sino ayudarte a calcularlo durante la partida.

**Board Record:** "Tus datos, a tu manera". Enfoque en la minería de datos personal y gráficos complejos.


### Analisis de precios

| Empresa     | Modelo de Precio       | Plan Gratuito                          | Coste Mensual (Aprox) | Opción de Pago Único (Lifetime)        |
|-------------|------------------------|----------------------------------------|-----------------------|----------------------------------------|
| BG Stats    | Pago App + IAP         | No (Solo versión muy básica o Lite)    | ~$1 USD (Cloud)       | Sí ~$5 App + ~$8 Expansiones            |
| ScorePal    | Freemium               | Sí. Limitado en funciones avanzadas    | N/A                   | Sí, ~$3 - $5 USD (Key)                  |
| Board Record| Freemium               | Sí. Con anuncios/límites               | N/A                   | Sí, ~$4 - $6 USD                        |

**Validación de Oportunidades para TabletopMastering**  
El hueco del "Todo Incluido": El análisis confirma una oportunidad frente a BG Stats. El líder del mercado cobra por la app base, cobra extra por "Deep Stats" y cobra extra por "Challenges". Esto genera rechazo. Un modelo de Pago Único Real (todo desbloqueado) por un precio intermedio ($8-$10) es muy atractivo.

Barrera de entrada: BGG es hostil en móviles y ScorePal se siente antiguo. Board Record es complejo. Existe un hueco para una app que sea visualmente hermosa (como LegendKeeper en el otro sector) pero fácil de usar desde el primer día.

**Oportunidades para TabletopMastering:**  
**--- "Social First" y Compartir (La oportunidad visual) ---**  
**Problema:** BG Stats y Board Record generan gráficos funcionales pero "feos" o demasiado técnicos. Compartir una victoria en Instagram/Stories requiere capturas de pantalla aburridas.

**Oportunidad:** Convertirse en la herramienta líder para "Flexing" (Presumir). Generar automáticamente imágenes bellas y diseñadas para Stories/Redes Sociales tras cada partida ("¡He ganado a Terraforming Mars!"). Estética sobre pura estadística.

**--- Gamificación del Jugador (Meta-juego) ---**  
**Problema:** Las apps actuales son "hojas de cálculo glorificadas". Registran datos pasivamente.

**Oportunidad:** Introducir Logros y Sistema de Niveles para el usuario. No solo registrar que jugaste, sino darte medallas por "Jugar 5 días seguidos", "Probar 3 juegos nuevos este mes", etc. Hacer que usar la app sea un juego en sí mismo.

**--- Modo "Party & Group" ---**
**Problema:** Normalmente solo una persona (el dueño de la app) registra la partida. Los demás jugadores no obtienen nada.

**Oportunidad:** Un sistema de "Lobby" local. El dueño abre la partida, genera un QR, y los amigos escanean para tener la partida registrada en sus propios perfiles al instante, sin necesidad de que todos tengan la app de pago. Sincronización grupal sin fricción.

