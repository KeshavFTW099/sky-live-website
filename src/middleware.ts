import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect CMS editing, file uploads, media management, product scraping,
  // and reading or deleting enquiries. Submission of enquiries (POST) is public.
  const isProtectedApi =
    path.startsWith('/api/content') ||
    path.startsWith('/api/media') ||
    path.startsWith('/api/upload') ||
    path.startsWith('/api/import-product') ||
    (path.startsWith('/api/enquiries') && req.method !== 'POST');

  if (isProtectedApi) {
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET || 'jwt-secret-skylife-9876543210-change-this',
    });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
