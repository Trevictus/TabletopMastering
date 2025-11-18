# 📋 Decisión Técnica: BoardGameGeek como Única Fuente de Datos

**Fecha:** 18 de noviembre de 2025  
**Estado:** ✅ Aprobada e Implementada

---

## 🎯 Decisión

**Mantener BoardGameGeek (BGG) como única fuente externa de datos de juegos**, descartando la integración con Board Game Atlas u otras APIs alternativas.

---

## 📊 Contexto

Durante el desarrollo del proyecto se evaluó la posibilidad de integrar **Board Game Atlas API** como complemento a BGG para obtener:
- Información de precios
- Mejor performance en búsquedas
- Datos de disponibilidad en tiendas

Sin embargo, tras el análisis técnico se decidió mantener únicamente BGG.

---

## ✅ Razones de la Decisión

### 1. **Estabilidad y Confiabilidad**
- BGG XML API2 es extremadamente estable (años de madurez)
- Board Game Atlas mostró problemas de conectividad intermitentes
- BGG es el estándar de facto en la comunidad de juegos de mesa

### 2. **Completitud de Datos**
- BGG tiene +100,000 juegos catalogados
- Ratings comunitarios con millones de valoraciones
- Mecánicas, categorías, diseñadores, editores
- Imágenes de alta calidad
- Historial completo de cada juego

### 3. **Integración Ya Completa**
- Sistema BGG 100% funcional en el proyecto
- Mock service implementado y testeado
- Documentación completa (GAMES_API_DOCS.md)
- Tests comprehensivos pasando
- Caché de 30 días implementado

### 4. **Simplicidad Arquitectónica**
- Un solo punto de integración externa
- Menos complejidad en el código
- Menos puntos de fallo potenciales
- Mantenimiento más sencillo
- Testing más directo

### 5. **Sin Costes Ocultos**
- BGG API es completamente gratuita
- Sin límites de rate restrictivos
- Sin necesidad de API keys
- Sin dependencias comerciales

### 6. **Enfoque del Proyecto**
- El proyecto NO es una tienda de juegos (no necesitamos precios en tiempo real)
- El objetivo es **gestionar partidas y estadísticas**
- BGG proporciona TODO lo necesario para este propósito

---

## ❌ Alternativas Descartadas

### Board Game Atlas
**Pros considerados:**
- API REST moderna (vs XML de BGG)
- Información de precios
- Mejor performance teórica

**Contras que llevaron al descarte:**
- ❌ Inestabilidad de servicio
- ❌ API key requerida
- ❌ Límites de rate más restrictivos
- ❌ Base de datos menor que BGG
- ❌ Complejidad innecesaria para el alcance del proyecto

### Otras APIs (BGG JSON API3, Geek Market, etc.)
- No aportan valor significativo sobre BGG XML API2
- Agregan complejidad sin beneficios claros

---

## 🎯 Implicaciones

### Para el Desarrollo
- ✅ Enfoque en mejorar la integración BGG existente
- ✅ Optimización del caché y performance
- ✅ Enriquecimiento de funcionalidades con datos BGG

### Para los Usuarios
- ✅ Experiencia consistente y predecible
- ✅ Datos siempre disponibles (alta disponibilidad BGG)
- ✅ Catálogo completo de juegos
- ⚠️ Sin información de precios en tiempo real (no crítico para el alcance)

### Para el Mantenimiento
- ✅ Un solo servicio externo que mantener
- ✅ Menos actualizaciones necesarias
- ✅ Testing más sencillo

---

## 🔮 Futuro

Esta decisión **NO** cierra la puerta a futuras integraciones si:
- Aparece una API claramente superior y estable
- Los requisitos del proyecto cambian significativamente
- Se necesita información que BGG no proporciona

Sin embargo, cualquier nueva integración deberá demostrar:
1. **Estabilidad probada** (mínimo 6 meses sin incidencias)
2. **Valor claro** que BGG no puede ofrecer
3. **Justificación de la complejidad** añadida

---

## 📚 Referencias

- [BoardGameGeek XML API2 Docs](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [GAMES_API_DOCS.md](../../backend/GAMES_API_DOCS.md)
- [Stack Tecnológico](../arquitectura/stack-tecnologico.md)
- [Servicio BGG](../../backend/services/bggService.js)

---

## 📝 Conclusión

**BoardGameGeek es la fuente perfecta** para Tabletop Mastering:
- Cumple con TODOS los requisitos del proyecto
- Es estable, confiable y completa
- Simplifica la arquitectura
- Reduce riesgos y complejidad

**Decisión final:** Mantener BGG como única fuente externa de datos de juegos. ✅
