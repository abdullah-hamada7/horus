import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const expectedPasscode = process.env.ADMIN_PASSCODE || "Horus2026";
    
    if (passcode === expectedPasscode) {
      const cookieStore = await cookies();
      cookieStore.set("admin_passcode_token", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 2, // 2 hours session
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_passcode_token")?.value;
    
    if (token === "authenticated") {
      return NextResponse.json({ authenticated: true });
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
