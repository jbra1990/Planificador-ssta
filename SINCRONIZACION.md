# Sincronizar el planificador entre tus dispositivos

La app puede mantener el celular y la computadora con los mismos datos, sin que el
servidor pueda leerlos: **todo se cifra en tu dispositivo antes de subir** (AES-GCM 256,
clave derivada de tu contraseña con PBKDF2). El proveedor solo almacena texto cifrado.

Necesitas una base de datos gratuita. Estas instrucciones usan **Supabase** (plan gratuito,
sin tarjeta de crédito). Se hace una sola vez, en unos 10 minutos.

## 1. Crear el proyecto

1. Entra a **supabase.com** y crea una cuenta (puedes usar tu cuenta de GitHub).
2. **New project**. Ponle un nombre (por ejemplo `planificador-sst`), elige una contraseña
   para la base de datos (esa no la vas a necesitar después) y la región más cercana.
3. Espera 1–2 minutos a que el proyecto quede listo.

## 2. Crear la tabla

En el menú lateral entra a **SQL Editor**, pega esto y pulsa **Run**:

```sql
create table if not exists public.planificador (
  id         text primary key,
  payload    text not null,
  updated_at timestamptz not null default now()
);

alter table public.planificador enable row level security;

create policy "lectura"     on public.planificador for select using (true);
create policy "inserción"   on public.planificador for insert with check (true);
create policy "actualización" on public.planificador for update using (true) with check (true);
```

Debe responder *Success*.

## 3. Copiar las dos claves

En **Project Settings → API** copia:

- **Project URL** — algo como `https://abcdefgh.supabase.co`
- **anon public** — una cadena larga que empieza con `eyJ...`

Ambas son públicas por diseño: sirven para conectarse, no para leer tus datos (que van
cifrados).

## 4. Activar en la computadora

1. Abre la app → **Ajustes → Configurar sincronización 🔒**
2. Pega la **URL del proyecto** y la **clave pública (anon key)**.
3. Escribe una **contraseña de cifrado** (mínimo 8 caracteres). Es tuya, no se sube a
   ningún lado, y es la que protege la información.
4. **Activar sincronización**. Arriba aparecerá el indicador **Al día**.

> ⚠️ Si olvidas la contraseña de cifrado, los datos que estén en la nube no se pueden
> recuperar. Anótala en un lugar seguro.

## 5. Vincular el celular

1. En la computadora: **Ajustes → Vincular otro dispositivo**. Se copia un
   **código de vinculación** (no contiene tu contraseña).
2. Pásate el código al celular (correo, WhatsApp, notas).
3. En el celular abre la app → **Ajustes → Configurar sincronización**, pega el código en
   el primer campo y escribe **la misma contraseña de cifrado**.
4. **Activar sincronización**. En segundos verás las mismas actividades y accidentes.

## Cómo se comporta

- Sincroniza al abrir la app, al volver a ella, cada minuto mientras está abierta y unos
  segundos después de cada cambio.
- La fusión es **por registro**: si editas en el celular y en la computadora cosas
  distintas, se conservan las dos. Si editas *el mismo* registro en ambos, queda la
  versión guardada más tarde.
- Los borrados también se propagan.
- Sin internet la app sigue funcionando con los datos locales y sube los cambios cuando
  vuelve la conexión.
- El indicador de arriba muestra el estado (**Al día**, *Sincronizando*, *Sin conexión* o
  el error). Tocándolo fuerza una sincronización.

## Qué ve el proveedor

Una sola fila con un identificador aleatorio y un bloque de texto cifrado. No puede ver
nombres de accidentados, actividades, fechas ni áreas. La contraseña nunca sale de tus
dispositivos.

## Límites que conviene conocer

- **Dentro del visor de artifacts de Claude la sincronización no funciona**: ese entorno
  bloquea las conexiones externas. Ahí la app trabaja solo con datos locales. La
  sincronización funciona en el sitio publicado (GitHub Pages) y al abrir el archivo
  localmente.
- Cualquiera que tenga la URL y la clave pública podría escribir filas en la tabla, pero
  no leer las tuyas (van cifradas) ni encontrar la tuya: el identificador es aleatorio.
- El plan gratuito de Supabase pausa los proyectos sin actividad después de un tiempo;
  basta con reactivarlo desde su panel.

## Si algo falla

| Mensaje | Qué significa |
|---|---|
| *Error: contraseña incorrecta* | La contraseña de cifrado no coincide con la del otro dispositivo. |
| *Sin acceso a la nube* | No hay internet, la URL está mal escrita o el proyecto está pausado. |
| *Error: HTTP 401* | La clave pública (anon key) es incorrecta. |
| *Error: HTTP 404* | Falta crear la tabla del paso 2. |
