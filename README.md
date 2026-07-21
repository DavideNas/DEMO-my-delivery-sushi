# 🍣 Sushi App — Enterprise Vue 3 Platform

[![Vue 3](https://img.shields.io/badge/Vue-3.4+-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1+-yellow?logo=vue.js&logoColor=white)](https://pinia.vuejs.org/)
[![Vuetify 3](https://img.shields.io/badge/Vuetify-3.5+-1867C0?logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Un'applicazione e-commerce moderna basata sull'architettura Vue 3, progettata per simulare la transizione da un contesto legacy (*brownfield*) a una piattaforma scalabile ed altamente testabile.

---

## 🏛️ Architettura e Decisioni Tecniche

* **Role-Based Access Control (RBAC)**: Autenticazione mockata via JWT con controllo dei permessi integrato (`guest`, `user`, `admin`) e direttive/componenti custom (`<PermissionGate>`).
* **State Management Ibrido**:
  * **Pinia (`useCartStore`)**: Gestione dello stato globale persistente del carrello.
  * **Provide / Inject (`CheckoutKey`)**: Contesto transitorio a memoria isolata per il flusso di checkout multi-step.
* **Architecture Decision Records (ADR)**: Documentazione formale delle scelte architetturali disponibile in `docs/adr/`.

---

## 🧪 Strategia di Testing

La piattaforma adotta il principio della piramide di testing:

* **Unit & Component Testing (Vitest)**:
  * Test isolati di composables, form validation e store Pinia.
* **End-to-End Testing (Playwright)**:
  * Copertura multi-browser (Chromium, Firefox) per il flusso critico di checkout multi-step con navigazione avanti/indietro e verifica di persistenza dei dati.

```bash
# Esecuzione Unit Test
npm run test:unit

# Esecuzione Test E2E
npx playwright test --project=chromium