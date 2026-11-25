import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { isLaunched, PREVIEW_COOKIE } from '@/lib/launch';

const COMING_SOON = '/proximamente';

// Rutas que siguen funcionando antes de la apertura
const ALLOWED_PREFIXES = [
  COMING_SOON,
  '/api', // webhooks y endpoints de Tiendanube
  '/admin', // panel (protegido por Clerk)
  '/login',
  '/registro',
  '/sync',
  '/__clerk',
];

function comingSoonGate(req: NextRequest): NextResponse | undefined {
  const { pathname, searchParams } = req.nextUrl;

  // En local (npm run dev) se navega libre. Para probar la redirección en local,
  // poné FORCE_COMING_SOON=1 en .env.local.
  if (process.env.NODE_ENV === 'development' && process.env.FORCE_COMING_SOON !== '1') {
    return;
  }

  if (isLaunched()) {
    // Después de la apertura, la página de "próximamente" ya no tiene sentido
    if (pathname === COMING_SOON) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return;
  }

  if (ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return;
  }

  // Acceso de vista previa: visitar cualquier URL con ?preview=<PREVIEW_KEY>
  const previewKey = process.env.PREVIEW_KEY;
  if (previewKey) {
    if (searchParams.get('preview') === previewKey) {
      const url = req.nextUrl.clone();
      url.searchParams.delete('preview');
      const res = NextResponse.redirect(url);
      res.cookies.set(PREVIEW_COOKIE, previewKey, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
    if (req.cookies.get(PREVIEW_COOKIE)?.value === previewKey) {
      return;
    }
  }

  // 307: redirección temporal, para que los buscadores no la guarden como definitiva
  return NextResponse.redirect(new URL(COMING_SOON, req.url), 307);
}

// Rutas que exigen sesión. El permiso de superadmin se valida además en el
// servidor (layout del admin, server actions y APIs), porque el mail no viaja en el token.
const requiresSession = createRouteMatcher(['/admin(.*)', '/profile(.*)']);

export default clerkMiddleware(
  async (auth, req) => {
    const gate = comingSoonGate(req);
    if (gate) return gate;
    if (requiresSession(req)) await auth.protect();
  },
  { signInUrl: '/login', signUpUrl: '/registro' },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
