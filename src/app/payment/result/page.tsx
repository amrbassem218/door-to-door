"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabaseClient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Status = "pending" | "paid" | "failed" | "unknown";

function Result() {
  const orderId = useSearchParams().get("order");
  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    if (!orderId) {
      setStatus("unknown");
      return;
    }
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    // The webhook may land a moment after the redirect, so poll briefly.
    const poll = async () => {
      const { data } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();
      const s = (data?.status ?? "unknown") as Status;
      setStatus(s);
      if (s === "pending" && ++tries < 10) timer = setTimeout(poll, 2000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [orderId]);

  const copy: Record<Status, [string, string]> = {
    pending: ["Confirming your payment…", "This usually takes a few seconds."],
    paid: ["Payment successful", "Thank you! Your order has been placed."],
    failed: ["Payment failed", "You have not been charged. Please try again."],
    unknown: ["Order not found", "We couldn't find this order."],
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
      <h1 className="text-2xl font-bold">{copy[status][0]}</h1>
      <p className="text-muted-foreground">{copy[status][1]}</p>
      <div className="pt-4">
        <Button asChild>
          <Link href={status === "failed" ? "/cart" : "/"}>
            {status === "failed" ? "Back to cart" : "Continue shopping"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <Result />
    </Suspense>
  );
}
