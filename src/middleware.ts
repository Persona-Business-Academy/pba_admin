import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return NextResponse.redirect(`${process.env.BASE_URL}/signin`);
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(`${process.env.BASE_URL}/signin`);
  }
}

export const config = {
  matcher: [
    "/users-list",
    "/online-courses",
    "/online-courses/(.*)",
    "/instructors",
    "/instructors/(.*)",
    "/offline-courses",
    "/offline-courses/(.*)",
    "/kids-offline-courses",
    "/kids-offline-courses/(.*)",
    "/jobs",
    "/jobs/(.*)",
    "/applicants",
    "/applicants/(.*)",
  ],
};
