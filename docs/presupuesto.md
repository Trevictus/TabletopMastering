# Fase 2.2f): Presupuesto y Valoración Económica

## 1. Coste por perfil
Se ha establecido un coste por hora basado en el perfil Junior Fullstack, alineado con la estrategia de mantener costes de desarrollo bajos para competir en precio.

| Perfil | Desarrollador | Coste/Hora |
| :--- | :--- | :---: |
| Junior Fullstack | @Aranaaa00 (Manuel) | 20 € |
| Junior Fullstack | @Trevictus (Victor) | 20 € |
| Junior Fullstack | @Juanfu224 (Juan) | 20 € |

## 2. Seguimiento y Desviaciones (Detalle por Sprint)
Comparativa entre la estimación y las horas reales imputadas.

| Sprint | Dev | H. Est. | H. Reales | Coste Real | Análisis de Desviación |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Sprint 1** | Victor | 18 | 12 | 240 € | Estimamos de más. Wireframes y paleta llevaron menos tiempo del previsto. |
| | Manuel | 8 | 10 | 200 € | Incluye revisiones y pruebas iniciales no contempladas en tickets. |
| | Juan | 10 | 8 | 160 € | Configuración de entorno y repo inicial fue fluida. |
| **Sprint 2** | Victor | 15 | 13 | 260 € | Preciso. Errores en configuración de React compensados con tareas rápidas. |
| | Manuel | 7 | 11 | 220 € | Incidencias en autenticación requirieron soporte extra. |
| | Juan | 8 | 9 | 180 € | La base de datos requirió un rediseño menor del esquema. |
| **Sprint 3** | Victor | 12 | 15 | 300 € | Falta de base teórica en el contexto de autenticación. |
| | Manuel | 8 | 12 | 240 € | Integración de APIs y lógica de ranking más compleja de lo esperado. |
| | Juan | 10 | 12 | 240 € | Apoyo en la lógica del backend y resolución de conflictos de merge. |
| **Sprint 4** | Victor | 14 | 10 | 200 € | Implementación de calendario rápida, con ligeras correcciones de UX. |
| | Manuel | 7 | 9 | 180 € | Validaciones de usuario requirieron correcciones adicionales. |
| | Juan | 8 | 7 | 140 € | Creación de seeders y datos de prueba fue eficiente. |
| **Sprint 5** | Victor | 15 | 10 | 200 € | Investigación de mercado extendida, pero desarrollo ágil. |
| | Manuel | 6 | 8 | 160 € | Refactorización y tareas DevOps (análisis/debugging) no contabilizadas. |
| | Juan | 8 | 10 | 200 € | Pruebas de integración detectaron fallos que hubo que corregir. |
| **Sprint 6** | Victor | 12 | 13 | 260 € | La documentación final requirió revisión profunda de redacción. |
| | Manuel | 7 | 10 | 200 € | Cierre del proyecto, limpieza de código y soporte final. |
| | Juan | 6 | 6 | 120 € | Documentación técnica y despliegue final. |

---

## 3. Costes Totales del Proyecto
Al finalizar la implementación, el desglose económico definitivo es el siguiente:

### 3.1 Resumen de horas de desarrollo
* **Victor:** 73 horas totales.
* **Manuel:** 60 horas totales.
* **Juan:** 52 horas totales.
* **Total Horas:** 185 horas.

### 3.2 Tabla de Presupuesto Final

| Concepto | Detalle | Coste Total |
| :--- | :--- | :---: |
| **Recursos Humanos** | Desarrollo de Software (185h x 20€/h) | **3.700,00 €** |
| **Infraestructura** | DigitalOcean Droplet (12€/mes x 2 meses de dev) | 24,00 € |
| **Dominios** | Name.com (Registro anual prorrateado al uso) | 3,25 € |
| **Herramientas** | GitHub Copilot (2 licencias x 2 meses - *Estimado*) | 40,00 € |
| **Contingencia** | Margen de seguridad (5% sobre costes directos) | 188,36 € |
| **TOTAL PROYECTO** | **Inversión total realizada** | **3.955,61 €** |

---

## 4. Valoración del Producto en el Mercado

### 4.1 Estrategia de Precios (Coherencia con Análisis Fase 1.1a)
El análisis de competidores (*BG Stats, ScorePal*) reveló un mercado fragmentado donde el usuario paga por la App base y luego paga extra por funcionalidades. Esto genera fricción.

Nuestra propuesta de valor es el modelo **"Todo Incluido"**.
* **Competencia:** BG Stats cuesta ~$13 USD para tener la experiencia completa.
* **Nuestra Estrategia:** Competir por precio y simplicidad.

### 4.2 Propuesta de Precio
Se establece un modelo de **Pago Único** para el uso de la plataforma.
* **Precio de venta:** **9,99 €**.
* *Justificación:* Se sitúa en el rango psicológico de "menos de 10€" identificado en el análisis como "muy atractivo", eliminando la resistencia a las suscripciones mensuales que existe en este nicho de hobby.

---

## 5. Retorno de Inversión (ROI)
**Inversión a recuperar:** ~3.956 €
**Ingreso neto por unidad vendida:** ~9,50 € descontando pasarelas de pago.
**Punto de Equilibrio:** Se necesitan vender **~417 licencias** para recuperar la inversión.

Se plantean 3 escenarios basados en ventas unitarias:

### Escenario A: Optimista (Viralidad en Redes/BGG)
* **Supuesto:** Lanzamiento exitoso en foros de BoardGameGeek y Reddit. Ventas de 60 licencias/mes.
* **Resultado:** Se recupera la inversión en **7 meses**.
* *Viabilidad:* Alta rentabilidad a corto plazo.

### Escenario B: Realista (Crecimiento de Nicho)
* **Supuesto:** Ventas iniciales moderadas (familiares/amigos) y crecimiento lento. Promedio de 25 licencias/mes.
* **Resultado:** El punto de equilibrio se alcanza en el **mes 17 (1 año y medio)**.
* *Viabilidad:* Aceptable para un proyecto secundario (Side Project), aunque el mantenimiento del servidor debe ser bajo.

### Escenario C: Pesimista (Saturación)
* **Supuesto:** El mercado prefiere BG Stats. Ventas residuales de 5 licencias/mes.
* **Resultado:** Se tardarían **6+ años** en recuperar la inversión.
* *Viabilidad:* El proyecto generaría pérdidas debido a que los costes de servidor (hosting anual) superarían a los ingresos.

---

## 6. Lecciones Aprendidas sobre Gestión Económica

1.  **Impacto del Modelo de Negocio en la Arquitectura:**
    * Al optar por un modelo de *Pago Único* (sugerido por el análisis de mercado) en lugar de *Suscripción*, nos enfrentamos al reto de mantener los costes de servidor (Recurrentes) con ingresos puntuales.
    * *Lección:* Para futuros proyectos con este modelo, deberíamos considerar arquitecturas *Serverless* (AWS Lambda/Firebase) que escalen a cero coste si no hay uso, en lugar de VPS fijo (DigitalOcean).

2.  **Desviaciones Técnicas:**
    * La mayor desviación económica (Sprint 3) vino de subestimar la complejidad de la lógica de negocio (Backend).
    * *Mejora:* Realizar "Spikes" (investigaciones técnicas breves) antes de estimar historias de usuario complejas en el Planning Poker.

3.  **Coste de la "Calidad Visual":**
    * El enfoque en "Imágenes para compartir" (ventaja competitiva detectada) consumió más horas de frontend de las estimadas en los Sprints 4 y 5. La diferenciación visual es cara de desarrollar.

4.  **Conclusión Final:**
    * El proyecto es viable económicamente (~4.000€ de coste) solo si logramos posicionarnos como la alternativa "moderna y barata" a BG Stats. La contención de costes en el desarrollo ha sido clave para permitirnos salir al mercado con un precio agresivo de 9,99€.