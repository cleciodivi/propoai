import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth?.user;
  const isPublicRoute = ["/login", "/register", "/"].includes(nextUrl.pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*", "/propostas/:path*", "/clientes/:path*"],
};
