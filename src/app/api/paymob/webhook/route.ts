import { verifyHmac } from "@/lib/paymob";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Paymob "transaction processed callback" (server-to-server).
export async function POST(req: Request) {
  const hmac = new URL(req.url).searchParams.get("hmac");
  const body = await req.json().catch(() => null);
  const obj = body?.obj;
  if (!obj || !verifyHmac(obj, hmac))
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const orderId: string | undefined = obj.order?.merchant_order_id;
  if (!orderId) return NextResponse.json({ ok: true });

  const admin = supabaseAdmin();
  const { data: order } = await admin
    .from("orders")
    .select("id, amount_cents, status")
    .eq("id", orderId)
    .single();
  if (!order) return NextResponse.json({ ok: true });
  if (order.status === "paid") return NextResponse.json({ ok: true });

  // Ignore in-flight transactions; wait for the final callback.
  if (obj.pending === true) return NextResponse.json({ ok: true });

  const paid =
    obj.success === true &&
    !obj.is_voided &&
    !obj.is_refunded &&
    Number(obj.amount_cents) === order.amount_cents;

  await admin
    .from("orders")
    .update({
      status: paid ? "paid" : "failed",
      paymob_transaction_id: String(obj.id),
      paid_at: paid ? new Date().toISOString() : null,
    })
    .eq("id", orderId);

  return NextResponse.json({ ok: true });
}
