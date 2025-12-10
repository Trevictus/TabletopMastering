# Legislación y Cumplimiento Normativo

Este documento recoge todas las normativas, requisitos legales y técnicos, y el plan de implementación seguido en el proyecto TabletopMastering.

---

## 1. Normativas aplicables

- **RGPD (Reglamento General de Protección de Datos)** - Protección de datos personales de usuarios europeos
- **LSSI-CE (Ley de Servicios de la Sociedad de la Información y Comercio Electrónico)** - Regulación de servicios digitales en España
- **WCAG 2.1 nivel AA (Web Content Accessibility Guidelines)** - Accesibilidad web para personas con discapacidad
- **Propiedad Intelectual** - Verificación de licencias y derechos de uso de recursos de terceros
- **Licencia MIT** - Licencia del código fuente del proyecto

---

## 2. Requisitos legales implementados

- **Consentimiento:**  
  Se obtiene mediante banner de cookies y formularios claros. El usuario puede aceptar, rechazar o configurar el uso de cookies y el tratamiento de datos personales.

- **Información transparente:**  
  Se informa al usuario sobre qué datos se recogen, finalidad, responsables y derechos en la política de privacidad y cookies.

- **Derechos de los usuarios:**  
  Se permite ejercer los derechos de acceso, rectificación, supresión, portabilidad y oposición mediante formulario de contacto o email.

- **Seguridad de los datos:**  
  Se han implementado medidas técnicas (HTTPS, cifrado, backups) y organizativas para proteger los datos personales.

---

## 3. Política de cookies y banner

- Banner funcional implementado en la web, con opciones de aceptación/configuración.
- Página específica de política de cookies accesible desde el banner y el footer.
- Consentimiento registrado y gestionado según RGPD.

---

## 4. Condiciones de uso y términos de servicio

- Documento redactado y adaptado al proyecto, accesible en `/terms`.
- Incluye derechos y obligaciones de usuarios y responsables del servicio, limitaciones de uso, política de responsabilidad y condiciones de cancelación de cuenta.
- Los usuarios deben aceptar estos términos durante el proceso de registro mediante checkbox obligatorio con enlaces a las políticas.
- Última actualización: Diciembre 2025.

---

## 5. Accesibilidad web (WCAG 2.1)

- Se han analizado y aplicado criterios de accesibilidad WCAG 2.1 nivel AA:  
  - **Contraste de color:** Relación mínima 4.5:1 en textos y 3:1 en componentes interactivos
  - **Navegación por teclado:** Todas las funcionalidades accesibles mediante teclado con indicadores visuales claros
  - **Etiquetas y descripciones:** Formularios con labels semánticos y mensajes de error descriptivos
  - **Uso de ARIA y roles semánticos:** Implementación de landmarks, roles y propiedades ARIA donde es necesario
  - **Diseño responsive:** Adaptación a diferentes dispositivos y tamaños de pantalla
  - **Texto alternativo:** Imágenes con atributos alt descriptivos
- Declaración de Accesibilidad disponible en `/accessibility` con detalles sobre el cumplimiento
- Mejoras implementadas y revisadas en todas las páginas principales del proyecto

---

## 6. Propiedad intelectual

- Todos los recursos utilizados han sido verificados y cuentan con licencias adecuadas:
  - **Iconos:** React Icons (licencia MIT) - librería de iconos open source
  - **Fuentes:** Google Fonts - fuentes bajo licencias libres
  - **Código del proyecto:** Licencia MIT - código fuente disponible públicamente
  - **Imágenes de juegos:** BoardGameGeek API - uso permitido según términos de la API
  - **Bibliotecas y dependencias:** Verificadas en el archivo `package.json`, todas bajo licencias compatibles (MIT, Apache 2.0, BSD)
- Se documentan las atribuciones y licencias en la página `/licenses` y en el README del proyecto
- No se utilizan recursos con copyright restrictivo sin la debida autorización

---

## 7. Normativa específica del sector

- El proyecto no está sujeto a normativa específica adicional de e-commerce, salud o finanzas, al ser una plataforma de gestión de grupos de juegos de mesa sin transacciones económicas directas.

---

## 8. Plan de implementación

- Las páginas legales han sido implementadas en las rutas:  
  - `/privacy` - Política de Privacidad  
  - `/cookies` - Política de Cookies  
  - `/terms` - Términos de Uso  
  - `/accessibility` - Declaración de Accesibilidad (WCAG 2.1)  
  - `/licenses` - Licencias y Atribuciones de recursos de terceros
- El banner de cookies está activo en todas las páginas.
- Funcionalidades de gestión de datos personales disponibles mediante formulario de contacto y enlaces en la política de privacidad.
- Accesibilidad revisada y validada en el frontend, con cumplimiento WCAG 2.1 nivel AA.
- Todas las páginas legales son accesibles desde el footer y el formulario de registro.

---

## 9. Enlaces a políticas y páginas legales

- [Política de Privacidad](/privacy)
- [Política de Cookies](/cookies)
- [Términos de Uso](/terms)
- [Declaración de Accesibilidad](/accessibility)
- [Licencias y Atribuciones](/licenses)

---

## 10. Referencias legales y fuentes consultadas

- [Agencia Española de Protección de Datos (AEPD)](https://www.aepd.es/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Guía LSSI-CE - INCIBE](https://www.incibe.es/protege-tu-empresa/blog/lssi-ce-que-es-y-como-cumplirla)
- [Creative Commons - Licencias](https://creativecommons.org/licenses/)
- [React Icons - MIT License](https://react-icons.github.io/react-icons/)
- [BoardGameGeek API Documentation](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [RGPD - Texto oficial](https://eur-lex.europa.eu/eli/reg/2016/679/oj)