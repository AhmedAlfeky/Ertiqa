import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // مثال بسيط: طباعة البيانات المستلمة
  console.log("Contact form submitted:", body);

  return NextResponse.json({ message: "تم إرسال الرسالة بنجاح." });
}