// supabase/functions/r2-upload-url/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import {
  S3Client,
  PutObjectCommand,
} from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

const getCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, X-Client-Info",
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders();

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get environment variables
    const R2_ACCOUNT_ID = Deno.env.get("R2_ACCOUNT_ID");
    const R2_ACCESS_KEY_ID = Deno.env.get("R2_ACCESS_KEY_ID");
    const R2_SECRET_ACCESS_KEY = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const R2_BUCKET_NAME = Deno.env.get("R2_BUCKET_NAME");

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return new Response(JSON.stringify({ error: "filename required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate all environment variables
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
      return new Response(JSON.stringify({ 
        error: "Missing environment variables",
        details: {
          R2_ACCOUNT_ID: !!R2_ACCOUNT_ID,
          R2_ACCESS_KEY_ID: !!R2_ACCESS_KEY_ID,
          R2_SECRET_ACCESS_KEY: !!R2_SECRET_ACCESS_KEY,
          R2_BUCKET_NAME: !!R2_BUCKET_NAME
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create the endpoint URL
    const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    console.log("Using endpoint:", endpoint);

    // Create S3 client with explicit configuration
    const s3Config = {
      region: "auto",
      endpoint: endpoint,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: false,
      // Add these to help with compatibility
      signerType: 'v4' as const,
    };

    console.log("S3 Config (sanitized):", {
      region: s3Config.region,
      endpoint: s3Config.endpoint,
      hasCredentials: !!s3Config.credentials,
      accessKeyPrefix: s3Config.credentials.accessKeyId.substring(0, 8) + "..."
    });

    const s3 = new S3Client(s3Config);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      ContentType: "application/octet-stream",
    });

    console.log("Creating signed URL for bucket:", R2_BUCKET_NAME, "key:", filename);

    // Generate signed URL with explicit configuration
    const uploadUrl = await getSignedUrl(s3, command, { 
      expiresIn: 900,
      // Force the correct signature version
      signableHeaders: new Set(['host']),
    });

    console.log("Generated URL domain:", new URL(uploadUrl).hostname);
    
    // Verify the URL contains the correct account ID
    if (!uploadUrl.includes(R2_ACCOUNT_ID)) {
      console.error("Generated URL does not contain correct account ID!");
      console.error("Expected account ID:", R2_ACCOUNT_ID);
      console.error("Generated URL domain:", new URL(uploadUrl).hostname);
    }

    return new Response(JSON.stringify({ 
      url: uploadUrl,
      debug: {
        expectedDomain: `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        actualDomain: new URL(uploadUrl).hostname,
        bucket: R2_BUCKET_NAME,
        filename: filename
      }
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Full error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5)
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});