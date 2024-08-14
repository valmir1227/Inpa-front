import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/",
    "/login",
    "/paciente/:path*",
    "/psicologo/:path*",
    "/checkout/:path*",
    "/corporativo/:path*",
    "/admin/:path*",
  ],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("inpatoken");
  //Se o cookie Inpa nao existir as prmissions seram undefined ou false;
  const permissions =
    req.cookies.has("inpa") &&
    JSON.parse(req.cookies.get("inpa") || ({} as any));

  const redirect = "/login?redirect=" + req.nextUrl.pathname;

  const isEnterprise = permissions?.enterprise;
  const isAdmin = permissions?.admin;
  const isExpert = permissions?.expert;
  const isPatient = permissions?.patient;

  if (req.nextUrl.pathname === "/login") {
    //redirecionamento desativado devido ao reset de senha usar a rota de login, e por isso 
    //nao funcionava para usuarios logados
    //   if (token) return NextResponse.redirect(new URL("/psicologos", req.url));
    return;
  }

  const query = req.nextUrl.searchParams;

  if (req.nextUrl.pathname.includes("/admin")) {
    if (!isAdmin) return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/") {

    if (isEnterprise)
      return NextResponse.redirect(new URL("/corporativo/usuarios", req.url));

    if (isAdmin) return NextResponse.redirect(new URL("/admin", req.url));

    if (isExpert)
      return NextResponse.redirect(new URL("/psicologo/sessoes", req.url));
    // if (isPatient || isExpert)

    if (query.has("redirect"))
      return NextResponse.redirect(new URL(query.get("redirect")!, req.url));
    return NextResponse.redirect(new URL("/psicologos", req.url));
  }

  if (token) {
    return;
  } else {
    return NextResponse.redirect(new URL(redirect, req.url));
  }
}
