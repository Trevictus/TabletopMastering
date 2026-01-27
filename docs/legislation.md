# Legislation and Regulatory Compliance

This document contains all regulations, legal requirements, and technical standards, as well as the implementation plan followed in the TabletopMastering project.

---

## 1. Applicable Regulations

- **GDPR (General Data Protection Regulation)** - Protection of personal data for European users
- **LSSI-CE (Law on Information Society Services and E-Commerce)** - Regulation of digital services in Spain
- **WCAG 2.1 Level AA (Web Content Accessibility Guidelines)** - Web accessibility for people with disabilities
- **Intellectual Property** - Verification of licenses and usage rights of third-party resources
- **MIT License** - License of the project's source code

---

## 2. Implemented Legal Requirements

- **Consent:**  
  Obtained through cookie banner and clear forms. Users can accept, reject, or configure cookie usage and personal data processing.

- **Transparent Information:**  
  Users are informed about what data is collected, its purpose, responsible parties, and their rights in the privacy and cookie policy.

- **User Rights:**  
  Users can exercise rights of access, rectification, deletion, portability, and objection via contact form or email.

- **Data Security:**  
  Technical measures (HTTPS, encryption, backups) and organizational measures have been implemented to protect personal data.

---

## 3. Cookie Policy and Banner

- Functional banner implemented on the website with acceptance/configuration options.
- Specific cookie policy page accessible from the banner and footer.
- Consent recorded and managed according to GDPR.

---

## 4. Terms of Use and Service Conditions

- Document drafted and adapted to the project, accessible at `/terms`.
- Includes user rights and obligations, service provider responsibilities, usage limitations, liability policy, and account cancellation conditions.
- Users must accept these terms during registration via mandatory checkbox with links to policies.
- Last updated: December 2025.

---

## 5. Web Accessibility (WCAG 2.1)

- WCAG 2.1 Level AA accessibility criteria have been analyzed and applied:  
  - **Color Contrast:** Minimum ratio of 4.5:1 for text and 3:1 for interactive components
  - **Keyboard Navigation:** All functionalities accessible via keyboard with clear visual indicators
  - **Labels and Descriptions:** Forms with semantic labels and descriptive error messages
  - **ARIA and Semantic Roles:** Implementation of landmarks, roles, and ARIA properties where necessary
  - **Responsive Design:** Adaptation to different devices and screen sizes
  - **Alternative Text:** Images with descriptive alt attributes
- Accessibility Statement available at `/accessibility` with compliance details
- Improvements implemented and reviewed on all main project pages

---

## 6. Intellectual Property

- All resources used have been verified and have appropriate licenses:
  - **Icons:** React Icons (MIT License) - open-source icon library
  - **Fonts:** Google Fonts - fonts under free licenses
  - **Project Code:** MIT License - source code publicly available
  - **Game Images:** BoardGameGeek API - usage permitted under API terms
  - **Libraries and Dependencies:** Verified in `package.json`, all under compatible licenses (MIT, Apache 2.0, BSD)
- Attributions and licenses documented on the `/licenses` page and in the project README
- No resources with restrictive copyright used without proper authorization

---

## 7. Industry-Specific Regulations

- The project is not subject to additional specific regulations for e-commerce, health, or finance, as it is a tabletop gaming group management platform without direct economic transactions.

---

## 8. Implementation Plan

- Legal pages have been implemented in the routes:  
  - `/privacy` - Privacy Policy  
  - `/cookies` - Cookie Policy  
  - `/terms` - Terms of Use  
  - `/accessibility` - Accessibility Statement (WCAG 2.1)  
  - `/licenses` - Licenses and Resource Attributions
- Cookie banner is active on all pages.
- Personal data management functionalities available via contact form and policy links.
- Accessibility reviewed and validated on the frontend, with WCAG 2.1 Level AA compliance.
- All legal pages accessible from footer and registration form.

---

## 9. Links to Policies and Legal Pages

- [Privacy Policy](/privacy)
- [Cookie Policy](/cookies)
- [Terms of Use](/terms)
- [Accessibility Statement](/accessibility)
- [Licenses and Attributions](/licenses)

---

## 10. Legal References and Consulted Sources

- [Spanish Data Protection Authority (AEPD)](https://www.aepd.es/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [LSSI-CE Guide - INCIBE](https://www.incibe.es/protege-tu-empresa/blog/lssi-ce-que-es-y-como-cumplirla)
- [Creative Commons - Licenses](https://creativecommons.org/licenses/)
- [React Icons - MIT License](https://react-icons.github.io/react-icons/)
- [BoardGameGeek API Documentation](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [GDPR - Official Text](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
