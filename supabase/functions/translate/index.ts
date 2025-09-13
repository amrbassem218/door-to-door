import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // allow all origins (or restrict to your domain)
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { text, target } = body;

    if (!text || !target) {
      return new Response(
        JSON.stringify({ error: "Missing 'text' or 'target'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate target language code (basic validation)
    const validLanguages = ['ar', 'zh', 'fr', 'de', 'hi', 'it', 'ja', 'ko', 'pt', 'ru', 'es', 'tr', 'vi'];
    if (!validLanguages.includes(target)) {
      console.log(`Invalid language code: ${target}`);
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${target}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Making request to LibreTranslate with: ${JSON.stringify({ q: text, source: "en", target, format: "text" })}`);
    
    // Try multiple LibreTranslate endpoints
    const endpoints = [
      "https://libretranslate.de/translate",
      "https://translate.argosopentech.com/translate"
    ];
    
    let upstream;
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        upstream = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: "en",
            target,
            format: "text",
          }),
        });
        
        if (upstream.ok) {
          console.log(`Success with endpoint: ${endpoint}`);
          break;
        } else {
          const errorText = await upstream.text();
          console.log(`Endpoint ${endpoint} failed: ${upstream.status} ${errorText}`);
          lastError = errorText;
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} error:`, error);
        lastError = error.message;
      }
    }

    if (!upstream || !upstream.ok) {
      console.error(`All LibreTranslate endpoints failed. Last error: ${lastError}`);
      return new Response(
        JSON.stringify({ error: "Translation service unavailable", details: lastError }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`LibreTranslate response status: ${upstream.status} ${upstream.statusText}`);

    const data = await upstream.json();
    console.log("LibreTranslate response data:", data);

    if (!data.translatedText) {
      console.error("No translated text received from LibreTranslate", data);
      return new Response(
        JSON.stringify({ error: "Translation failed", details: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ translatedText: data.translatedText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
