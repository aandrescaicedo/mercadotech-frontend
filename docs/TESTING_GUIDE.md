# Guía de Ejecución de Pruebas - MercadoTech MVP

Esta guía detalla paso a paso cómo ejecutar el plan de pruebas completo del proyecto y dónde encontrar los resultados generados.

## 📁 Estructura de Documentación

Todos los artefactos de prueba y documentación técnica se encuentran en la carpeta `docs/`:

- `docs/ER_Diagram.md`: Diagrama Entidad-Relación completo.
- `docs/Sequence_Diagram_Auth.md`: Diagrama de secuencia de Autenticación.
- `docs/Sequence_Diagram_Create.md`: Diagrama de secuencia de Creación (Productos/Pedidos).
- `docs/Sequence_Diagram_UpdateDelete.md`: Diagrama de secuencia de Actualización/Eliminación.
- `docs/test/`: Carpeta donde se generarán los reportes de ejecución.

---

## 🚀 1. Pruebas de Backend (Unitarias e Integración)

Estas pruebas verifican la lógica de negocio y los endpoints de la API.

### Requisitos Previos
- Node.js instalado
- Estar en la carpeta `backend/`

### Paso a Paso

1. **Abrir terminal** y navegar a la carpeta del backend:
   ```bash
   cd backend
   ```

2. **Instalar dependencias** (si no lo ha hecho):
   ```bash
   npm install
   ```

3. **Ejecutar todas las pruebas (Unitarias + Integración):**
   ```bash
   npm test
   ```

4. **Generar Reporte de Cobertura:**
   Este comando ejecuta las pruebas y genera un reporte detallado de qué porcentaje del código está cubierto.
   ```bash
   npm run test:coverage
   ```

### 📊 Ver Resultados
Una vez finalizado el comando `npm run test:coverage`, los resultados se guardarán automáticamente en:
- **Ruta:** `docs/test/backend/coverage/index.html`
- **Cómo ver:** Abra ese archivo en su navegador web para ver el reporte interactivo.

---

## 🌐 2. Pruebas de Frontend (E2E con Playwright)

Estas pruebas simulan un usuario real interactuando con la aplicación en el navegador.

### Requisitos Previos
- Backend corriendo (en otra terminal: `cd backend && npm run dev`)
- Estar en la carpeta `frontend/`

### Paso a Paso

1. **Abrir terminal** y navegar a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias** (si no lo ha hecho):
   ```bash
   npm install
   npx playwright install  # Instala los navegadores necesarios
   ```

3. **Ejecutar pruebas E2E (modo headless/sin interfaz):**
   ```bash
   npm run test:e2e
   ```

4. **Ejecutar pruebas con interfaz gráfica (opcional, para depurar):**
   ```bash
   npm run test:e2e:ui
   ```

### 📊 Ver Resultados
Al finalizar `npm run test:e2e`, Playwright generará un reporte HTML.
- **Ruta:** `docs/test/frontend/report/index.html`
- **Cómo ver:** Abra el archivo en su navegador o ejecute:
  ```bash
  npx playwright show-report ../docs/test/frontend/report
  ```

---

## 📝 Resumen de Comandos

| Componente | Acción | Comando | Resultado en |
|------------|--------|---------|--------------|
| **Backend** | Tests Unitarios + Integración | `npm test` | Consola |
| **Backend** | Reporte de Cobertura | `npm run test:coverage` | `docs/test/backend/coverage/` |
| **Frontend** | Tests E2E | `npm run test:e2e` | `docs/test/frontend/report/` |
| **Frontend** | Tests E2E (UI Mode) | `npm run test:e2e:ui` | Interfaz Interactiva |

---

## ✅ Checklist de Verificación

Al finalizar la ejecución, verifique:
1. [ ] Backend: Todos los tests pasan (verde en consola).
2. [ ] Backend: Cobertura > 70% en el reporte HTML.
3. [ ] Frontend: Los 3 flujos críticos (Auth, Shopping, Store) pasan exitosamente.
4. [ ] Los reportes se han generado correctamente en la carpeta `docs/test/`.
