# Planificador-ssta

Aplicativo para planificación de actividades y accidentes laborales — Coordinación de
Seguridad (SST).

Es un solo archivo (`index.html`) sin dependencias externas: se abre en cualquier
navegador, se instala como app en el celular y funciona también sin conexión.

**Sitio:** https://jbra1990.github.io/Planificador-ssta/ *(disponible al activar GitHub
Pages — ver más abajo)*

## Qué hace

**Actividades**
- Registro con tipo, estatus, prioridad, responsable, involucrados y notas.
- Fechas de registro, cierre tentativo y **fecha de cumplimiento** (el plazo comprometido).
- Estatus **Atrasada** automático al pasar el plazo sin completar, con alerta.
- Subactividades (checklist) con barra de progreso por actividad.
- Tablero agrupado **por categoría**, y dentro por **prioridad** y **vencimiento más próximo**.
- Pestaña de completadas, tablero por estatus y análisis con porcentajes por tipo y estatus.

**Accidentes laborales**
- Nombre del accidentado, fecha, sede (Matriz / Regional Norte), área y clasificación en
  orden jerárquico: EAI, ETM, EPA, Itinere, En otro centro de trabajo, En desplazamiento,
  Incidente.
- **Fecha máxima de reporte**: 10 días laborables contando el día del accidente,
  descontando sábados, domingos y feriados nacionales de Ecuador. Los feriados móviles
  (Carnaval y Viernes Santo) se calculan a partir del domingo de Pascua, así que el cálculo
  sirve para cualquier año. La app muestra qué feriados descontó.
- Orden por proximidad de vencimiento y **alerta cuando faltan 3 días hábiles o menos**.

## Activar el sitio (GitHub Pages)

1. En este repositorio: **Settings → Pages**.
2. En *Source* elegir **Deploy from a branch**.
3. Branch: **main**, carpeta **/ (root)**. **Save**.
4. A los 1–2 minutos queda publicado en
   https://jbra1990.github.io/Planificador-ssta/

## Instalarla en el iPhone

1. Abrir el sitio en **Safari**.
2. Botón **Compartir** → **Añadir a pantalla de inicio**.
3. Queda con su ícono propio y se abre a pantalla completa, sin barra del navegador.

> En iOS, la app añadida a la pantalla de inicio puede guardar sus datos por separado de
> las pestañas normales de Safari. Conviene usar siempre la misma vía (o el ícono, o
> Safari) para no dividir los registros.

## Dónde viven los datos

En el navegador del dispositivo (`localStorage`). Para tenerlos en el celular y en la
computadora a la vez se activa la **sincronización cifrada de extremo a extremo**: los
datos se cifran en el equipo con una contraseña propia antes de subir, así que el servidor
solo almacena texto ilegible. Ver **[SINCRONIZACION.md](SINCRONIZACION.md)**.

Sin sincronización, los datos se trasladan con *Ajustes → Respaldo cifrado* y luego
*Importar respaldo*.

## Estructura

| Archivo | Para qué |
|---|---|
| `index.html` | La aplicación completa: estructura, estilos y lógica. |
| `sw.js` | Service worker: permite usarla sin conexión una vez publicada. |
| `SINCRONIZACION.md` | Guía para activar la sincronización entre dispositivos. |
