# Fase 1.1a): Análisis del sector: Board Game Tracking & Scoring Tools

## 1. Clasificación del Sector
> **Definición del Mercado:** Herramientas de registro y puntuación de juegos de mesa. El mercado está dominado por aplicaciones móviles que buscan reemplazar el papel y lápiz, integrándose casi siempre con la base de datos de BoardGameGeek (BGG).

Hemos seleccionado **5 competidores clave** que representan las diferentes amenazas para el proyecto **TabletopMastering**:

* **Board Game Stats (BG Stats):** El líder indiscutible (Países Bajos). B2C Pago único + DLCs. Es el estándar para usuarios avanzados.
* **ScorePal:** Competidor veterano en Android. B2C Freemium. Enfocado en lógica de puntuación y "hojas inteligentes".
* **BGG Catalog:** Soluciones ligeras/Open Source. B2C Gratuito. Gestores de colección sencillos vinculados a BGG.
* **Board Record (Boardlog):** Startup Indie. B2C Freemium. Enfocado en visualización de datos y personalización extrema.
* **BoardGameGeek (BGG):** La gran plataforma (El "Notion" del sector). B2B/B2C Gratuito con publicidad. La base de datos origen de todo el hobby.

---

## 2. Análisis de Características Organizativas

### Board Game Stats (BG Stats)
Es el "World Anvil" de este sector. Un proyecto personal de un desarrollador (Eerko Visscher) que se ha convertido en el estándar de oro. Muy profesional y pulido.
* **Equipo:** < 5 (Principalmente fundador + soporte comunitario).
* **Tecnología:** Desarrollo Nativo (iOS y Android optimizados por separado), Sincronización propia en la nube y API de BGG.

### ScorePal
Aplicación veterana nacida para resolver la complejidad de sumar puntos en juegos difíciles (ej. Agrícola). Desarrollo ralentizado en los últimos años.
* **Equipo:** 1-2 (Indie Dev).
* **Tecnología:** Android nativo (Java/Kotlin). Fuerte enfoque en bases de datos locales y scripts lógicos.

### Board Record (Boardlog)
El competidor moderno y flexible. Se posiciona como la alternativa potente para usuarios que quieren "masticar" datos.
* **Equipo:** < 5 (Indie Hacker).
* **Tecnología:** Android, enfoque modular donde el usuario define qué datos ver.

### BoardGameGeek (La Plataforma)
La gran corporación (adquirida recientemente por grupos de inversión, mantiene gestión comunitaria).
* **La Amenaza:** No tienen una app nativa perfecta, pero poseen los datos. Si lanzaran una app oficial moderna, dominarían el sector instantáneamente.

---

## 3. Comparativa Competitiva

| Empresa | Modelo de Ingresos | Puntos Fuertes | Puntos Débiles | Stack Tecnológico (Est.) |
| :--- | :--- | :--- | :--- | :--- |
| **BG Stats** | Pago App + DLCs <br>*(Subscripción Cloud opcional)* | UX muy pulida. Importación/Exportación impecable. Soporte constante. | Modelo de cobro fragmentado (App base + "Deep Stats" + "Challenges"). | Swift (iOS), Java/Kotlin (Android) |
| **ScorePal** | Freemium (Pro Key) | Asistentes de puntuación paso a paso (Lógica de juego vs. solo sumas). | Interfaz visualmente desactualizada. Curva de aprendizaje alta. | Android Nativo |
| **Board Record**| Freemium | Visualización de datos superior (gráficos, tartas). Muy personalizable. | Puede abrumar al usuario casual. Menos enfoque en estética UI. | Android / Flutter (o similar) |
| **BGG Catalog** | Gratuito / Donación | Simple y directo. Ideal para gestión de inventario. | Muy limitado en registro de partidas (Logging). A menudo son web wrappers. | Híbrido / Web Wrappers |
| **BGG (Web)** | Publicidad / Donaciones | Base de datos infinita. Comunidad masiva. | UX/UI de los años 2000. Lento en móvil. Requiere conexión. | PHP (Legacy), MySQL |

---

## 4. Análisis de Producto y Precios

### Propuesta de Valor Única (UVP)
* **BG Stats:** "Cuantifica tu hobby". Trata el juego de mesa como un deporte con estadísticas serias.
* **ScorePal:** "Olvídate de las matemáticas". Ayuda a calcular el resultado durante la partida, no solo a guardarlo.
* **Board Record:** "Tus datos, a tu manera". Minería de datos personal y gráficos complejos.

### Estructura de Precios

| Empresa | Modelo | Plan Gratuito | Coste Mensual (Aprox) | Opción de Pago Único (Lifetime) |
| :--- | :--- | :--- | :--- | :--- |
| **BG Stats** | Pago App + IAP | No (Solo Lite muy básica) | ~$1 USD (Cloud) | Sí, ~$5 App + ~$8 Expansiones |
| **ScorePal** | Freemium | Sí (Funciones limitadas) | N/A | Sí, ~$3 - $5 USD (Key) |
| **Board Record**| Freemium | Sí (Con anuncios/límites) | N/A | Sí, ~$4 - $6 USD |

---

## 5. Validación de Oportunidades para "TabletopMastering"

### El Hueco del "Todo Incluido"
El análisis confirma una oportunidad clara frente al líder, **BG Stats**.
* **Fricción actual:** BG Stats cobra por la app, luego cobra extra por "Deep Stats" y extra por "Challenges". Esto genera rechazo en el usuario.
* **Solución:** Un modelo de **Pago Único Real** (todo desbloqueado) por un precio intermedio ($8-$10) es muy atractivo.
* **Barrera de entrada:** Existe un hueco para una app que sea **visualmente hermosa** (estilo LegendKeeper) pero fácil de usar desde el primer día, alejándose de la complejidad de Board Record o la antigüedad de ScorePal.

### Oportunidades Funcionales Clave

#### 1. "Social First" y Compartir (La oportunidad visual)
* **Problema:** La competencia genera gráficos funcionales pero poco atractivos o técnicos. Compartir una victoria en Instagram Stories requiere capturas de pantalla básicas.
* **Oportunidad:** Convertirse en la herramienta líder para "Flexing" (Presumir). Generar automáticamente imágenes diseñadas para RRSS tras cada partida ("¡He ganado a Terraforming Mars!"). **Estética sobre pura estadística.**

#### 2. Gamificación del Jugador (Meta-juego)
* **Problema:** Las apps actuales son "hojas de cálculo glorificadas". El registro es pasivo.
* **Oportunidad:** Introducir **Logros y Sistema de Niveles**. Dar medallas por "Jugar 5 días seguidos" o "Probar 3 juegos nuevos". Hacer que usar la app sea un juego en sí mismo.

#### 3. Modo "Party & Group"
* **Problema:** Solo una persona registra la partida; los demás jugadores no obtienen el registro en sus móviles.
* **Oportunidad:** Sistema de **"Lobby" con QR**. El dueño abre la partida, genera un QR, y los amigos escanean para tener la partida registrada en sus perfiles al instante. Sincronización grupal sin fricción.