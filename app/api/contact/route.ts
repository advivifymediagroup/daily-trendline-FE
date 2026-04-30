import { NextResponse } from "next/server";
import { createContactSubmission } from "@/app/api/news";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  if (!STRAPI_URL) {
    return NextResponse.json(
      { error: "Missing STRAPI base URL configuration." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const strapiResponse = await createContactSubmission({
      name,
      email,
      subject,
      message,
    });

    if (!strapiResponse.ok) {
      return NextResponse.json(
        {
          error: "Strapi rejected the contact form submission.",
          details: strapiResponse.data,
        },
        { status: strapiResponse.status || 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while submitting the contact form." },
      { status: 500 },
    );
  }
}
