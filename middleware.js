// export { auth as middleware } from "./auth";

// // Or like this if you need to do something here.
// // export default auth((req) => {
// //   console.log(req.auth) //  { session: { user: { ... } } }
// // })

// // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const session = await auth();
  const PUBLIC_ROUTES = ["/", "/signin"];
  const ADMIN_ROUTES = ["/dashboard"];
  const MAIN_ROUTES = ["/chat"];
  const ROOT = "/";
  const DEFAULT_REDIRECT = "/chat";
  const ADMIN_DEFAULT_REDIRECT = "/dashboard";
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAdminRoute = ADMIN_ROUTES.includes(nextUrl.pathname);
  const isMainRoute = MAIN_ROUTES.includes(nextUrl.pathname);
  const isAdmin = req.auth?.user?.role == "admin" ? true : false;
  const haveDBAccess = req.auth?.user?.db_access;

  // console.log({
  //   user: req.auth,
  //   isAdminRoute,
  //   isAuthenticated,
  //   isAdmin,
  //   session,
  //   haveDBAccess,
  //   isMainRoute,
  // });

  if (isAdminRoute && isAuthenticated && isAdmin) return;

  if (isAdminRoute && isAuthenticated && !isAdmin)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (isPublicRoute && isAuthenticated && (isAdmin || haveDBAccess))
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (
    (!isAuthenticated && !isPublicRoute) ||
    (isAuthenticated && !haveDBAccess && isMainRoute)
  )
    return Response.redirect(new URL(ROOT, nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
