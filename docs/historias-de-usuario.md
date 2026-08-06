# Historias de Usuario — NutriMacros

Estas son las cinco historias de usuario que definen el alcance del proyecto. Cada una está
registrada en el tablero de Jira (`NQ-1` a `NQ-5`) y tiene **3 casos de prueba automatizados**:
camino feliz, prueba negativa y prueba de límites.

---

## HU-1 — Inicio de sesión

**Como** usuario registrado de NutriMacros
**quiero** iniciar sesión con mi usuario y contraseña
**para** acceder de forma privada a mis mediciones corporales y mi plan nutricional.

### Criterios de aceptación
- Al ingresar usuario y contraseña válidos, el sistema me redirige al listado de mediciones (`/measurements`).
- Si la contraseña está vacía, el sistema muestra el mensaje "La contrasena es requerida" y permanezco en la pantalla de login.
- Si las credenciales son incorrectas, el sistema muestra un mensaje genérico ("Usuario o contrasena incorrectos") que no revela si el usuario existe.
- La sesión se mantiene activa mientras navego entre secciones.

### Criterios de rechazo
- Se rechaza si con credenciales inválidas el sistema permite el acceso a `/measurements`.
- Se rechaza si el mensaje de error revela cuál de los dos campos falló (permitiría enumerar usuarios).
- Se rechaza si la contraseña viaja o se almacena en texto plano.

### Casos de prueba automatizados
| Tipo | Caso | Archivo |
|---|---|---|
| Camino feliz | `admin` / `Admin123!` → redirige a `/measurements` | `test/e2e/01-login.test.js` |
| Prueba negativa | Contraseña incorrecta → error "Usuario o contrasena incorrectos" | `test/e2e/01-login.test.js` |
| Prueba de límites | Contraseña vacía (0 caracteres) → error "La contrasena es requerida" | `test/e2e/01-login.test.js` |

---

## HU-2 — Registrar medición corporal

**Como** usuario que sigue su progreso físico
**quiero** registrar una nueva medición corporal (fecha, peso, altura, torso, brazo y objetivo)
**para** llevar un historial de mi evolución y calcular mis macros.

### Criterios de aceptación
- Al guardar una medición con todos los campos válidos, aparece en el listado y se muestra el mensaje "Medicion registrada exitosamente".
- El peso se acepta en el rango de 50 a 700 lb, ambos extremos incluidos.
- Si un campo obligatorio queda vacío o fuera de rango, el formulario se vuelve a mostrar con el mensaje de error junto al campo y **sin perder** los demás datos ya escritos.

### Criterios de rechazo
- Se rechaza si se guarda un registro con el peso vacío o fuera del rango 50–700 lb.
- Se rechaza si una validación fallida crea igualmente el registro.
- Se rechaza si al fallar la validación se pierden los valores que el usuario ya había escrito.

### Casos de prueba automatizados
| Tipo | Caso | Archivo |
|---|---|---|
| Camino feliz | Medición válida (176 lb) → aparece en el listado | `test/e2e/02-create-measurement.test.js` |
| Prueba negativa | Peso vacío → error de validación, no se crea | `test/e2e/02-create-measurement.test.js` |
| Prueba de límites | 50 lb (mínimo) se acepta / 49 lb se rechaza | `test/e2e/02-create-measurement.test.js` |

---

## HU-3 — Consultar mediciones y plan nutricional

**Como** usuario autenticado
**quiero** ver el historial de mis mediciones y calcular un plan de alimentos según mi presupuesto
**para** saber qué comprar sin exceder lo que puedo gastar.

### Criterios de aceptación
- El listado muestra todas las mediciones registradas, ordenadas de la más reciente a la más antigua.
- Al indicar un presupuesto semanal válido, el sistema calcula mis macros diarios (calorías, proteína, carbohidratos y grasas) a partir de mi última medición.
- El sistema sugiere alimentos cuyo precio por porción cabe en el presupuesto, ordenados por mayor aporte de proteína por peso invertido.
- El acceso sin sesión iniciada redirige al login.

### Criterios de rechazo
- Se rechaza si un usuario sin sesión puede ver `/measurements`.
- Se rechaza si un presupuesto muy bajo (sin alimentos disponibles) produce un error 500 o una página en blanco en lugar de un mensaje controlado.
- Se rechaza si un identificador inexistente provoca una excepción no manejada.

### Casos de prueba automatizados
| Tipo | Caso | Archivo |
|---|---|---|
| Camino feliz | 3 mediciones listadas + macros y sugerencias con RD$2500 | `test/e2e/03-read-measurements.test.js` |
| Prueba negativa | Sin sesión → redirige a `/login` | `test/e2e/03-read-measurements.test.js` |
| Prueba de límites | Presupuesto RD$1 → mensaje "No se encontraron alimentos dentro de tu presupuesto" | `test/e2e/03-read-measurements.test.js` |

---

## HU-4 — Actualizar medición corporal

**Como** usuario que cometió un error al registrar
**quiero** editar una medición existente
**para** corregir los datos sin tener que borrarla y crearla de nuevo.

### Criterios de aceptación
- Al editar el peso y el objetivo, los nuevos valores se reflejan en el listado con el mensaje "Medicion actualizada exitosamente".
- La fecha de hoy es un valor válido.
- Si la validación falla, el registro original permanece intacto.

### Criterios de rechazo
- Se rechaza si el sistema acepta una fecha futura.
- Se rechaza si un valor no numérico en el peso (por ejemplo "abc") se guarda o corrompe el registro original.
- Se rechaza si al fallar la validación el registro queda parcialmente actualizado.

### Casos de prueba automatizados
| Tipo | Caso | Archivo |
|---|---|---|
| Camino feliz | Editar peso a 199 lb y objetivo a "subir" → se refleja en el listado | `test/e2e/04-update-measurement.test.js` |
| Prueba negativa | Peso "abc" → error, se conserva el valor original (195) | `test/e2e/04-update-measurement.test.js` |
| Prueba de límites | Fecha de hoy se acepta / fecha de mañana se rechaza | `test/e2e/04-update-measurement.test.js` |

---

## HU-5 — Eliminar medición corporal

**Como** usuario que registró un dato equivocado
**quiero** eliminar una medición con una confirmación previa
**para** no borrar información por accidente.

### Criterios de aceptación
- Al pulsar "Eliminar" se muestra una pantalla de confirmación con el detalle de la medición.
- Al confirmar, la medición desaparece del listado y se muestra "Medicion eliminada exitosamente".
- Al cancelar, la medición se conserva sin ningún cambio.
- Si se elimina la última medición existente, se muestra el mensaje "No hay mediciones registradas".

### Criterios de rechazo
- Se rechaza si la eliminación ocurre sin pantalla de confirmación previa.
- Se rechaza si cancelar elimina el registro igualmente.
- Se rechaza si al quedar la lista vacía la página falla o muestra una tabla vacía sin mensaje.

### Casos de prueba automatizados
| Tipo | Caso | Archivo |
|---|---|---|
| Camino feliz | Confirmar → la fila desaparece, contador -1 | `test/e2e/05-delete-measurement.test.js` |
| Prueba negativa | Cancelar → la medición se conserva | `test/e2e/05-delete-measurement.test.js` |
| Prueba de límites | Eliminar la única medición → estado vacío controlado | `test/e2e/05-delete-measurement.test.js` |

---

## Resumen de cobertura

| Historia | Camino feliz | Prueba negativa | Prueba de límites | Total |
|---|:---:|:---:|:---:|:---:|
| HU-1 Login | ✅ | ✅ | ✅ | 3 |
| HU-2 Crear | ✅ | ✅ | ✅ | 3 |
| HU-3 Leer | ✅ | ✅ | ✅ | 3 |
| HU-4 Actualizar | ✅ | ✅ | ✅ | 3 |
| HU-5 Eliminar | ✅ | ✅ | ✅ | 3 |
| **Total** | **5** | **5** | **5** | **15** |
