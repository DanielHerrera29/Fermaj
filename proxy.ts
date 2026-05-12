import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/portal", request.url))
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: session, error } = await supabase
    .from("web_sessions")
    .select("*, user:web_users(*)")
    .eq("token", sessionToken)
    .gte("expires_at", new Date().toISOString())
    .single()

  if (error || !session) {
    return NextResponse.redirect(new URL("/portal", request.url))
  }

  const { pathname } = new URL(request.url)

  if (pathname.startsWith("/portal/dashboard/admin")) {
    if (session.user.role !== "superadmin" && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/portal/dashboard", request.url))
    }
  }

  const response = NextResponse.next()
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}

export const config = {
  matcher: ["/portal/dashboard/:path*"],
}
