export {default} from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/categories',
    '/add-company',
    '/companies',
    '/companies/:path*',
    '/pages',
  ],
};
