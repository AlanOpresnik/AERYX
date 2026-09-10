# Integración AERYX + Tiendanube (Headless)

## Arquitectura

```
AERYX Frontend (Next.js 16)
  ├── Server Components → lib/tiendanube/client.ts → Tiendanube API
  ├── API Routes (app/api/tiendanube/*) → Tiendanube API
  ├── Cart (localStorage + React Context)
  └── Checkout → Draft Orders API → Tiendanube Hosted Checkout
```

## 1. Crear App en Tiendanube

1. Ir a [Tiendanube Partners Portal](https://partners.tiendanube.com/) y crear una cuenta
2. Crear una nueva aplicación
3. Configurar:
   - **Nombre**: AERYX Frontend
   - **Redirect URL**: `https://tu-dominio.com/api/auth/tiendanube/callback`
   - **Scopes necesarios**:
     - `read_products` — listar y leer productos
     - `write_products` — (opcional, solo si querés gestionar desde AERYX)
     - `read_orders` — listar y leer órdenes
     - `write_orders` — crear draft orders para checkout
     - `read_customers` — leer datos de clientes
4. Anotar el **Client ID** y **Client Secret**

## 2. Obtener Credenciales

### OAuth Flow (primera vez)

1. Instalar la app en tu tienda desde el Partners Portal
2. Serás redirigido a la URL de autorización:
   ```
   GET https://www.tiendanube.com/apps/{CLIENT_ID}/authorize
   ```
3. Aceptar permisos → recibirás un `code` en la redirect URL
4. Intercambiar por access token:
   ```bash
   curl -X POST https://www.tiendanube.com/apps/authorize/token \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "TU_CLIENT_ID",
       "client_secret": "TU_CLIENT_SECRET",
       "grant_type": "authorization_code",
       "code": "CODIGO_RECIBIDO"
     }'
   ```
5. Respuesta:
   ```json
   {
     "access_token": "abc123...",
     "token_type": "bearer",
     "scope": "read_products write_orders ...",
     "user_id": 123456
   }
   ```
   - `access_token` → es tu `TIENDANUBE_ACCESS_TOKEN`
   - `user_id` → es tu `TIENDANUBE_STORE_ID`

> **Nota:** El access token de Tiendanube NO expira. Se mantiene válido hasta que desinstales la app.

## 3. Variables de Entorno

Copiar `.env.example` a `.env.local` y completar:

```env
# Clerk Authentication (existente)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Tiendanube API
TIENDANUBE_STORE_ID=123456
TIENDANUBE_ACCESS_TOKEN=abc123def456...
TIENDANUBE_CLIENT_ID=1234
TIENDANUBE_CLIENT_SECRET=secret_abc123...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **NUNCA** subir `.env.local` al repositorio. Ya está en `.gitignore`.

## 4. Ejecutar Localmente

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Registrar webhooks (requiere HTTPS para producción)
# npx tsx scripts/register-webhooks.ts

# Iniciar dev server
pnpm dev
```

Abrir `http://localhost:3000` → los productos de tu Tiendanube deberían aparecer.

## 5. Endpoints de Tiendanube Utilizados

| Endpoint | Uso en AERYX |
|---|---|
| `GET /v1/{store_id}/products` | Listar productos (home, catálogo) |
| `GET /v1/{store_id}/products/{id}` | Detalle de producto |
| `GET /v1/{store_id}/categories` | Listar categorías |
| `POST /v1/{store_id}/draft_orders` | Crear checkout → redirect |
| `GET /v1/{store_id}/orders` | Listar órdenes (admin, perfil) |
| `GET /v1/{store_id}/orders/{id}` | Detalle de orden |
| `GET /v1/{store_id}/webhooks` | Listar webhooks registrados |
| `POST /v1/{store_id}/webhooks` | Registrar webhook |

## 6. API Routes Internas (Next.js)

| Ruta | Método | Descripción |
|---|---|---|
| `/api/tiendanube/products` | GET | Lista productos mapeados |
| `/api/tiendanube/products/[id]` | GET | Producto individual mapeado |
| `/api/tiendanube/categories` | GET | Lista categorías |
| `/api/tiendanube/cart/validate` | POST | Valida items del carrito contra Tiendanube |
| `/api/tiendanube/checkout` | POST | Crea Draft Order → devuelve checkout_url |
| `/api/tiendanube/orders` | GET | Lista órdenes |
| `/api/tiendanube/orders/[id]` | GET | Orden individual |
| `/api/tiendanube/orders/metrics` | GET | Métricas para dashboard admin |
| `/api/webhooks/tiendanube` | POST | Recibe webhooks de Tiendanube |

## 7. Webhooks Configurados

| Evento | Acción |
|---|---|
| `product/created` | Invalida cache de productos |
| `product/updated` | Invalida cache de productos |
| `product/deleted` | Invalida cache de productos |
| `order/created` | Invalida cache de órdenes |
| `order/paid` | Invalida cache de órdenes |
| `order/updated` | Invalida cache de órdenes |
| `order/cancelled` | Invalida cache de órdenes |
| `category/created` | Invalida cache de categorías |
| `category/updated` | Invalida cache de categorías |
| `category/deleted` | Invalida cache de categorías |

### Registrar webhooks:
```bash
npx tsx scripts/register-webhooks.ts
```

> Los webhooks requieren una URL HTTPS pública. Para desarrollo local, usar [ngrok](https://ngrok.com/) o similar.

### Verificación de firma:
Los webhooks se verifican con HMAC-SHA256 usando el `TIENDANUBE_CLIENT_SECRET` y el header `x-linkedstore-hmac-sha256`.

## 8. Flujo de Checkout

```
1. Usuario agrega productos al carrito (localStorage)
2. Click "Finalizar compra" en /checkout
3. Frontend envía POST /api/tiendanube/checkout con variant_ids y cantidades
4. Backend crea Draft Order en Tiendanube API
5. Tiendanube devuelve checkout_url
6. Frontend redirige: window.location.href = checkout_url
7. Usuario completa datos, envío y pago en Tiendanube
8. Tiendanube procesa el pago (Mercado Pago, etc.)
9. Tiendanube dispara webhook order/paid
10. Cache de órdenes se invalida automáticamente
```

## 9. Convención de Datos Custom en Productos

Como Tiendanube no tiene metafields, los datos custom de AERYX se codifican así:

### En la descripción del producto (Tiendanube admin):
```
Texto de descripción general del producto...

---SPECS---
Superficie: Tela antideslizante premium
Base: Goma natural antideslizante
Espesor: 4mm
Compatibilidad: Todos los ratones
Cuidado: Lavar con paño húmedo

---FEATURES---
Alta precisión de tracking
Bordes cosidos reforzados
Base antideslizante

---SETUP---
Colocar sobre superficie plana
Retirar el film protector
```

### En los tags del producto (Tiendanube admin):
```
tipo:mousepad, drop:genesis, nuevo, descuento, tag:GAMING
```

El frontend parsea automáticamente estos datos para mostrarlos en los componentes existentes.

## 10. Conectar en Producción

1. Desplegar en Vercel (o tu hosting)
2. Configurar las variables de entorno en el hosting
3. Actualizar `NEXT_PUBLIC_APP_URL` con el dominio de producción
4. Registrar webhooks apuntando al dominio de producción:
   ```bash
   NEXT_PUBLIC_APP_URL=https://aeryx.com.ar npx tsx scripts/register-webhooks.ts
   ```
5. Configurar en Tiendanube admin la "Thank You Page" URL si querés que el usuario vuelva a AERYX después del checkout

## 11. Cache y Revalidación

| Recurso | TTL | Estrategia |
|---|---|---|
| Productos | 60s | ISR + on-demand via webhook |
| Categorías | 300s | ISR + on-demand via webhook |
| Órdenes | 0s | Sin cache (siempre fresh) |

Los webhooks de Tiendanube invalidan el cache automáticamente cuando hay cambios.

## 12. Rate Limits

- **Burst**: 40 requests
- **Sustained**: 2 req/segundo
- **Planes avanzados**: x10 (400 burst, 20 req/s)

El cliente de Tiendanube maneja automáticamente el rate limiting con retry + backoff.

## 13. Limitaciones Conocidas

1. **No hay checkout headless** — Tiendanube maneja todo el checkout en su dominio
2. **No hay API de cotización de envío** — El envío se calcula dentro del checkout de Tiendanube
3. **No hay metafields** — Los datos custom van en description (con delimitadores) y tags
4. **No hay Cart API** — El carrito vive en localStorage del frontend
5. **IDs numéricos** — Los IDs de Tiendanube son numéricos, no ObjectIDs de MongoDB
6. **Filtro de órdenes por email** — No hay endpoint de "mis órdenes"; se filtra por email
