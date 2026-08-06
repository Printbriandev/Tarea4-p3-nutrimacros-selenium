# Evidencia de ejecución

Copia de una corrida completa de `npm test`, versionada en el repositorio para que la
evidencia sea visible sin necesidad de clonar el proyecto ni ejecutar nada.

| Contenido | Ubicación |
|---|---|
| Reporte HTML | `reports/mochawesome/index.html` |
| Reporte en JSON | `reports/mochawesome/index.json` |
| Capturas de pantalla | `screenshots/` — una por cada uno de los 15 casos |

**Resultado de la corrida: 15 casos ejecutados, 15 aprobados, 0 fallidos.**

Las capturas se nombran con el patrón `<historia>_<caso>__<estado>.png`, donde el estado es
`OK` o `FALLO`. Se toman en **todos** los escenarios, no solo en los que fallan.

> Para ver el reporte, descarga la carpeta y abre `reports/mochawesome/index.html` en un
> navegador. Las imágenes se enlazan de forma relativa, así que ambas carpetas deben
> mantenerse juntas.
