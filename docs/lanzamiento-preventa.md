# Lanzamiento de la preventa — 1/12

La web se abre sola el **1/12 a las 00:00 (hora Argentina)**: el middleware deja de mandar a `/proximamente`.
Lo que sigue es lo que hay que dejar listo antes, en orden.

## 1. Dominio

- [x] `aeryx.com.ar` conectado en Vercel: redirige a `https://www.aeryx.com.ar`, que es la dirección principal.

## 2. Clerk en producción (bloqueante)

Hoy la web usa las claves de **desarrollo**: por eso el cartel "Development mode" y los límites de usuarios.

- [ ] En Clerk: crear la instancia de **Production** con el dominio `aeryx.com.ar` y cargar en Vercel DNS los registros que pide.
- [ ] Activar los mismos métodos de acceso que en desarrollo (mail + contraseña, Google, Apple).
- [ ] Copiar las claves de producción a Vercel (paso 3).
- [ ] Recomendado: activar la verificación en dos pasos y exigirla.

## 3. Variables de entorno en Vercel (Production)

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | clave `pk_live_…` de Clerk producción |
| `CLERK_SECRET_KEY` | clave `sk_live_…` de Clerk producción |
| `TIENDANUBE_STORE_ID` | igual que en `.env.local` |
| `TIENDANUBE_ACCESS_TOKEN` | igual que en `.env.local` |
| `TIENDANUBE_CLIENT_ID` | igual que en `.env.local` |
| `TIENDANUBE_CLIENT_SECRET` | igual que en `.env.local` (verifica los webhooks) |
| `PREVIEW_KEY` | una clave larga inventada: permite ver la web antes del 1/12 |
| `NEXT_PUBLIC_APP_URL` | `https://www.aeryx.com.ar` |

`NEXT_PUBLIC_API_URL` **no** va: era el backend viejo; la web ya no lo necesita.

## 4. Cuenta superadmin y contenido (en producción)

Los anuncios y la configuración de la preventa se guardan en la cuenta superadmin de Clerk. Los de desarrollo **no** pasan solos a producción.

- [ ] Entrar a `https://www.aeryx.com.ar/registro?preview=<PREVIEW_KEY>` y crear la cuenta `aeryxinfo@gmail.com` (verificar el mail).
- [ ] `/admin/preventa`: fechas (1/12 al 20/12), **fecha de despacho**, **tope de regalos**, "una por mousepad".
- [ ] `/admin/anuncios`: recrear el anuncio con fin **20/12**, link "Ver mousepads" → `/catalog`, aviso en el carrito para "Mousepads".

## 5. Tiendanube

- [ ] Medio de pago activo (Mercado Pago u otro) y envíos configurados.
- [ ] Producto oculto **"Manga de compresión — Regalo de preventa"**: dejarlo **sin publicar**. Su stock = tope de regalos (se puede cambiar desde `/admin/preventa`).
- [ ] Página de confirmación de compra: en *Configuración → Códigos externos*, agregar un link o redirección a `https://www.aeryx.com.ar/checkout/gracias` (la web muestra el pedido y el regalo).
- [ ] Mail de confirmación de pedido: sumar "Tu manga de regalo está reservada".
- [x] Webhooks registrados (productos, categorías y pedidos) → `https://www.aeryx.com.ar/api/webhooks/tiendanube`. Necesitan `TIENDANUBE_CLIENT_SECRET` en Vercel: sin esa variable la web los rechaza.

## 6. Ensayo general (antes del 1/12, con `?preview=`)

1. [ ] Abrir `https://www.aeryx.com.ar/?preview=<PREVIEW_KEY>`: la web completa, no "próximamente".
2. [ ] Iniciar sesión con la cuenta superadmin y revisar el admin.
3. [ ] Con la preventa abierta temporalmente (`/admin/preventa`, fecha de inicio hoy): agregar un mousepad al carrito → aparece la manga de regalo y "Ahorrás".
4. [ ] Pagar con un medio sin cobro real (transferencia o "acordar con el vendedor").
5. [ ] En el checkout de Tiendanube: la manga figura a $0.
6. [ ] Volver a la web → aviso "¿Ya pagaste tu pedido?" → `/checkout/gracias` con el regalo.
7. [ ] El pedido aparece en Mi cuenta y en `/admin/pedidos` con la etiqueta "Regalo".
8. [ ] Cancelar el pedido de prueba en Tiendanube y **volver la fecha de inicio al 1/12**.

## 7. El 1/12

- [ ] 00:00: confirmar que la web abre sola y que se ven la barra y los sellos de preventa.
- [ ] Revisar los primeros pedidos en `/admin/preventa`.
