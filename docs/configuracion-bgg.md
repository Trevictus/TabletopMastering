# Configuración de BoardGameGeek (BGG)

## 🎭 Mock Permanente

Este proyecto está configurado para **usar siempre datos simulados (mock)** en lugar de conectarse a la API real de BoardGameGeek.

### ¿Por qué usar el mock?

- ✅ **Sin dependencias externas**: No requiere conectividad con BGG
- ✅ **Respuestas instantáneas**: Sin tiempos de espera de red
- ✅ **Sin rate limiting**: No hay límites de peticiones
- ✅ **Datos consistentes**: Resultados predecibles para testing
- ✅ **Funciona offline**: No necesita conexión a Internet
- ✅ **Más ligero**: Menos dependencias npm instaladas

### Datos simulados disponibles

El mock incluye una base de datos simulada con juegos populares como:

- **Catan** (bggId: 13)
- **Carcassonne** (bggId: 822)
- **Ticket to Ride** (bggId: 9209)
- **Pandemic** (bggId: 30549)
- **7 Wonders** (bggId: 68448)
- **Azul** (bggId: 230802)
- Y muchos más...

### Estructura del código

```
backend/services/
├── bggService.js          # Siempre redirige al mock
├── bggService.mock.js     # Implementación del mock
└── bggGameService.js      # Lógica de negocio
```

### Variables de entorno

```bash
# Siempre en true
USE_BGG_MOCK=true
```

Esta variable está fija en:
- `.env`
- `.env.example`
- `.env.example.prod`
- `docker-compose.yml`
- `docker-compose-prod.yml`

### Dependencias eliminadas

Al usar solo el mock, se han eliminado estas dependencias:
- `axios` (peticiones HTTP)
- `axios-cookiejar-support` (gestión de cookies)
- `tough-cookie` (cookies HTTP)
- `xml2js` (parseo de XML)

Esto reduce el tamaño de la imagen Docker y mejora el tiempo de build.

### Ventajas adicionales

1. **Testing más rápido**: Los tests no dependen de servicios externos
2. **Desarrollo offline**: Puedes trabajar sin Internet
3. **Deploy más simple**: No hay que configurar keys de API
4. **Más estable**: Sin fallos por caídas de BGG
5. **Menor latencia**: Respuestas instantáneas

### ¿Cómo funciona?

Cuando la aplicación busca juegos:

1. El controlador llama a `bggGameService`
2. Este llama a `bggService`
3. `bggService` automáticamente usa `bggService.mock`
4. El mock retorna datos simulados de su base de datos

Todo es transparente para el resto de la aplicación.

### Personalización

Para agregar más juegos al mock, edita:
```
backend/services/bggService.mock.js
```

Y añade juegos al array `MOCK_GAMES_DB`.
