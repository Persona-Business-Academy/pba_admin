import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextApiRequest) {
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

export const config = { matcher: ['/todo'] };
