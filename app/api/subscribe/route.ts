import { NextResponse } from "next/server";

/**
 * Newsletter subscription stub.
 * Replace the body of this handler with a real integration
 * (e.g. Mailchimp/Resend/Buttondown, or a Strapi "subscriber" collection).
 */
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  console.log(`[newsletter] subscription request: ${email}`);
  return NextResponse.json({ ok: true });
}
