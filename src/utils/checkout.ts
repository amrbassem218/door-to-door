import { supabase } from "@/supabase/supabaseClient";

export interface CheckoutItem {
  productId: number | string;
  quantity: number;
  measurement: string;
}

/** Creates a Paymob checkout on the server and redirects the browser to it. */
export async function startCheckout(items: CheckoutItem[]) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not signed in");

  const res = await fetch("/api/paymob/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ items }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(data?.error ?? "Checkout failed");
  window.location.href = data.url;
}
