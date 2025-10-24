import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Login endpoint is working." });
}