import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log(req.url);
  console.log(req);
  return NextResponse.next();
}