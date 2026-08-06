# NutriMacros — Pruebas Automatizadas con Selenium WebDriver

Aplicación web con autenticación y operaciones CRUD, junto a una suite de **15 pruebas
automatizadas end-to-end** implementadas con **Selenium WebDriver en JavaScript**.

Las pruebas están escritas íntegramente en código. **No se utilizó Selenium IDE.**

---

## La aplicación

**NutriMacros** calcula los macronutrientes diarios de una persona a partir de sus medidas
corporales y le sugiere alimentos que se ajustan a un presupuesto declarado.

| Módulo | Descripción |
|---|---|
| Autenticación | Inicio de sesión con contraseña hasheada (`bcryptjs`) y sesión de servidor |
| Mediciones corporales | CRUD completo: fecha, peso (lb), altura (in), torso (cm), brazo (cm) y objetivo |
| Plan nutricional | Calcula calorías, proteína, carbohidratos y grasas con la fórmula Mifflin-St Jeor, y filtra un catálogo de 20 alimentos según el presupuesto |

### Sobre los precios del catálogo

Los precios están en pesos dominicanos y son valores de referencia con fines ilustrativos.
Decidí **no** integrar una API de precios en tiempo real: una dependencia externa haría que
las pruebas automatizadas dejaran de ser deterministas, ya que los datos podrían cambiar o el
servicio podría no responder durante una corrida.

### Credenciales de prueba

```
Usuario:     admin
Contraseña:  Admin123!
```

---

## Stack

| Capa | Tecnología |
|---|---|
| Servidor | Node.js + Express |
| Vistas | EJS (renderizado en servidor) |
| Automatización | Selenium WebDriver 4 (JavaScript) |
| Test runner | Mocha + Chai |
| Reporte | Mochawesome (HTML con capturas embebidas) |

---

## Puesta en marcha

### Requisitos
- Node.js 18 o superior
- Google Chrome instalado

El chromedriver no se instala aparte: Selenium Manager, incluido en `selenium-webdriver`, lo
descarga automáticamente en la primera ejecución.

### Instalación

```bash
npm install
```

### Levantar la aplicación

```bash
npm start
```

Disponible en `http://localhost:3000`.

### Ejecutar las pruebas

```bash
npm test
```

Abre Chrome, ejecuta los 15 casos y genera el reporte. El servidor de la aplicación se levanta
y se apaga automáticamente dentro del proceso de pruebas, así que **no** debe haber un
`npm start` corriendo en paralelo (el puerto 3000 quedaría ocupado).

Para ejecutar sin ventana de navegador:

```bash
npm run test:headless
```

### Artefactos generados

| Artefacto | Ubicación |
|---|---|
| Reporte HTML | `reports/mochawesome/index.html` |
| Capturas de pantalla | `screenshots/` — una por cada caso de prueba |
| Evidencia de referencia | `docs/evidence/` — copia versionada de una corrida completa |

---

## Cobertura de pruebas

Cinco historias de usuario, cada una con **camino feliz**, **prueba negativa** y **prueba de límites**.

| Historia | Camino feliz | Prueba negativa | Prueba de límites |
|---|---|---|---|
| **HU-1** Inicio de sesión | Credenciales válidas → accede | Contraseña incorrecta → error genérico | Contraseña vacía (0 caracteres) |
| **HU-2** Registrar medición | Medición válida se crea | Peso vacío → no se crea | 50 lb se acepta / 49 lb se rechaza |
| **HU-3** Consultar y planificar | Lista + macros + sugerencias | Sin sesión → redirige al login | Presupuesto RD$1 → mensaje controlado |
| **HU-4** Actualizar medición | Peso y objetivo actualizados | Peso "abc" → original intacto | Hoy se acepta / mañana se rechaza |
| **HU-5** Eliminar medición | Confirmar → se elimina | Cancelar → se conserva | Última medición → estado vacío |

**Total: 15 casos automatizados.**

El detalle de cada historia, con sus criterios de aceptación y de rechazo, está en
[`docs/historias-de-usuario.md`](docs/historias-de-usuario.md).

---

## Estructura

```
src/                      Aplicación (Express + EJS)
  config/                 Usuario semilla
  data/                   Almacén en memoria y catálogo de alimentos
  domain/                 Cálculo de macronutrientes
  middleware/             Autenticación y endpoint de reset restringido a modo test
  routes/                 Rutas HTTP
  validators/             Reglas de validación
  views/                  Plantillas EJS

test/
  e2e/                    5 specs, uno por historia de usuario
  pages/                  Page Objects (uno por pantalla)
  support/                WebDriver, hooks, reset de estado y capturas
```

---

## Decisiones de diseño

**Renderizado en servidor en vez de una SPA.** Cada acción es una petición HTTP completa, así
que las pruebas solo esperan a que aparezca un elemento en lugar de lidiar con estados
asíncronos del cliente.

**Page Object Model.** Los selectores viven en una sola clase por pantalla. Si cambia la
interfaz ajusto un archivo, no los cinco specs.

**Selectores por `id` y atributos `data-*`.** No dependen del texto visible ni de la estructura
CSS, así que sobreviven a cambios de diseño.

**Endpoint de reset restringido a modo test.** `POST /__test__/reset` reinicia los datos a una
semilla conocida antes de cada prueba y responde `404` fuera de `NODE_ENV=test`. Esto hace que
las pruebas sean deterministas y permite construir escenarios límite —como "una sola
medición"— sin tener que manipularlos a través de la interfaz.

**Confirmación de borrado como página real** en lugar de `window.confirm()`, para evitar el
manejo de alertas nativas del navegador, que son frágiles en Selenium.

**Capturas de todos los escenarios**, no solo de los que fallan, adjuntas al reporte HTML.

**Servidor levantado dentro del proceso de Mocha.** Al principio usé `start-server-and-test`,
pero ese paquete invoca `wmic.exe` para detener el servidor, y esa utilidad ya no existe en las
versiones recientes de Windows 11: el proceso quedaba colgado indefinidamente. Moverlo a los
root hooks de Mocha resolvió el problema y eliminó una dependencia.

**`bcryptjs` en lugar de `bcrypt`.** El segundo requiere compilación nativa y falla en Windows
sin las Build Tools instaladas.
