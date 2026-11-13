import { createIntention } from "@/lib/paymob";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const UNIT_FACTOR: Record<string, number> = {
  KG: 1,
  Ton: 1000,
  Grams: 1 / 1000,
  // Mirrors the factor used by newPrice() in utilities.tsx so the charge matches the price shown.
  Ounces: 35.274,
};

const SHIPPING_USD = 10; // same flat shipping shown on the cart page

async function shippingInEgp(): Promise<number> {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/egp.json",
  );
  const data = await res.json();
  const usdPerEgp = data?.egp?.usd;
  if (!usdPerEgp) throw new Error("Could not fetch exchange rates");
  return SHIPPING_USD / usdPerEgp;
}

export async function POST(req: Request) {
  const admin = supabaseAdmin();

  // Authenticate the caller from their Supabase access token.
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: userData, error: authError } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (authError || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const requested: { productId: number | string; quantity: number; measurement?: string }[] =
    body?.items;
  if (!Array.isArray(requested) || requested.length === 0)
    return NextResponse.json({ error: "No items" }, { status: 400 });

  // Re-price everything on the server; never trust client-sent prices.
  const ids = requested.map((i) => Number(i.productId));
  const { data: products, error: prodError } = await admin
    .from("products")
    .select("id, name, price_before, discount")
    .in("id", ids);
  if (prodError || !products)
    return NextResponse.json({ error: "Could not load products" }, { status: 500 });

  const lines: { name: string; amount: number; description: string; quantity: number }[] = [];
  for (const item of requested) {
    const p = products.find((x) => x.id === Number(item.productId));
    const qty = Number(item.quantity);
    // The cart stores measurements in lowercase ("kg"); the UI uses "KG", "Ton", ...
    const measurement =
      Object.keys(UNIT_FACTOR).find(
        (k) => k.toLowerCase() === (item.measurement ?? "KG").toLowerCase(),
      ) ?? "";
    if (!p || p.price_before == null || !(qty > 0) || !measurement)
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    const unit = p.price_before * (1 - (p.discount ?? 0) / 100);
    const cents = Math.round(unit * UNIT_FACTOR[measurement] * qty * 100);
    lines.push({
      name: p.name.slice(0, 50),
      amount: cents,
      description: `${qty} ${measurement}`,
      quantity: 1,
    });
  }

  try {
    lines.push({
      name: "Shipping",
      amount: Math.round((await shippingInEgp()) * 100),
      description: "Shipping",
      quantity: 1,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not compute shipping" }, { status: 502 });
  }

  const amountCents = lines.reduce((s, l) => s + l.amount, 0);

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      amount_cents: amountCents,
      currency: "EGP",
      items: lines,
    })
    .select("id")
    .single();
  if (orderError || !order) {
    console.error(orderError);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  ).replace(/\/+$/, "");
  const meta = (user.user_metadata ?? {}) as Record<string, string>;
  const fullName = (meta.full_name ?? meta.name ?? "").trim().split(/\s+/);

  try {
    const { checkoutUrl, intentionId } = await createIntention({
      amountCents,
      currency: "EGP",
      items: lines,
      billing: {
        first_name: fullName[0] || "NA",
        last_name: fullName.slice(1).join(" ") || "NA",
        email: user.email ?? "NA",
        phone_number: user.phone || meta.phone || "NA",
      },
      merchantOrderId: order.id,
      notificationUrl: `${origin}/api/paymob/webhook`,
      redirectionUrl: `${origin}/payment/result?order=${order.id}`,
    });
    await admin.from("orders").update({ paymob_intention_id: intentionId }).eq("id", order.id);
    return NextResponse.json({ url: checkoutUrl, orderId: order.id });
  } catch (e) {
    console.error(e);
    await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: "Could not start payment" }, { status: 502 });
  }
}
