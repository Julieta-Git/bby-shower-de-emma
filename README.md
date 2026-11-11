# Baby shower de Emma Isabella

Invitación web animada (HTML, CSS y JS sin dependencias). Inspirada en el diseño de Canva que pasó la mamá: rosa y amarillo pastel, solecito con carita, guirnaldas de estrellas.

## Cómo completar los datos

Todo se edita en `config.js`:

- `fecha`: día y hora, formato `"2026-12-20T16:00"`. Al cargarla aparecen la cuenta regresiva y el botón "Agendar".
- `lugar.nombre` y `lugar.direccion`: el link de Maps ya está cargado.
- `whatsapp`: número para confirmar asistencia (ej. `5493704123456`). Al cargarlo aparece el botón "Confirmar asistencia".
- `confirmarAntesDe`: texto opcional, ej. `"antes del 10 de diciembre"`.
- `regalos`: la lista de sugerencias.

## Fotos

Poner en `assets/fotos/`:

- `ecografia.webp`: va debajo de "Un pequeño rayito de sol". Si no está, se ve un solecito.
- `papis-1.webp`, `papis-abrazo.webp`, `papis-2.webp`: polaroids en "Mis papis".
- `papis-globos.webp`: en la confirmación.
- Los originales están en la carpeta del proyecto (fotos-originales).

## Estado

- Implementado: portada para abrir, solecitos flotando, guirnaldas, secciones de la inspo, lista de regalos, botón Cómo llegar, cuenta regresiva y confirmación por WhatsApp (se activan con los datos).
- Pendiente: fecha y hora, nombre/dirección del lugar, WhatsApp, publicar.
