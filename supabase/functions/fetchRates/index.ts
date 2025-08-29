import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // use Service Role for insert
  );

  try {
    const url =
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/egp.json";
    const res = await fetch(url);
    const data = await res.json();

    // insert new rates
    // await supabase.from("currency_rates").insert({ rates: data.egp });
    

    return new Response("Rates updated", { status: 200 });
  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 });
  }
});
