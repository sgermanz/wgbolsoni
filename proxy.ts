import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, isLocale, isPublicPage, LANGUAGE_COOKIE, localeHref, splitLocalePath } from "@/lib/i18n/routing";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const split = splitLocalePath(pathname);
  if (!isPublicPage(split.pathname)) return NextResponse.next();
  const selected = request.nextUrl.searchParams.get("lang");
  if (isLocale(selected)) {
    const destination = request.nextUrl.clone();
    destination.pathname = localeHref(selected, split.pathname);
    destination.searchParams.delete("lang");
    const response = NextResponse.redirect(destination, 307);
    response.cookies.set(LANGUAGE_COOKIE, selected, { path: "/", sameSite: "lax", maxAge: 31536000, secure: request.nextUrl.protocol === "https:" });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  const saved = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const bot = /bot|crawler|spider|slurp|facebookexternalhit|preview/i.test(request.headers.get("user-agent") ?? "");
  const preferred = isLocale(saved) ? saved : bot ? "pt" : detectLocale(request.headers.get("accept-language"));
  if (!split.locale && preferred !== "pt" && request.method === "GET") {
    const destination = request.nextUrl.clone();
    destination.pathname = localeHref(preferred, pathname);
    const response = NextResponse.redirect(destination, 307);
    response.headers.set("Vary", "Accept-Language, Cookie");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  if (split.locale === "pt") {
    const destination = request.nextUrl.clone();
    destination.pathname = split.pathname;
    const response = NextResponse.redirect(destination, 307);
    response.cookies.set(LANGUAGE_COOKIE, "pt", { path: "/", sameSite: "lax", maxAge: 31536000, secure: request.nextUrl.protocol === "https:" });
    response.headers.set("Vary", "Accept-Language, Cookie");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  const headers = new Headers(request.headers);
  headers.set("x-wgb-locale", split.locale ?? "pt");
  headers.set("x-wgb-pathname", split.pathname);
  if (split.locale) {
    const destination = request.nextUrl.clone();
    destination.pathname = split.pathname;
    return NextResponse.rewrite(destination, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|admin|_next|media|.*\\..*).*)"] };
