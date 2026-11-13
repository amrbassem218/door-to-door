import crypto from "crypto";

const BASE_URL = process.env.PAYMOB_BASE_URL ?? "https://accept.paymob.com";

export interface PaymobIntentionInput {
  amountCents: number;
  currency: string;
  items: { name: string; amount: number; description: string; quantity: number }[];
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  merchantOrderId: string;
  notificationUrl: string;
  redirectionUrl: string;
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

/** Creates a Paymob payment intention and returns the hosted checkout URL. */
export async function createIntention(input: PaymobIntentionInput) {
  const secretKey = requireEnv("PAYMOB_SECRET_KEY");
  const publicKey = requireEnv("PAYMOB_PUBLIC_KEY");
  const integrationIds = requireEnv("PAYMOB_INTEGRATION_IDS")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter(Boolean);

  const res = await fetch(`${BASE_URL}/v1/intention/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountCents,
      currency: input.currency,
      payment_methods: integrationIds,
      items: input.items,
      billing_data: {
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        city: "NA",
        country: "EG",
        state: "NA",
        ...input.billing,
      },
      special_reference: input.merchantOrderId,
      notification_url: input.notificationUrl,
      redirection_url: input.redirectionUrl,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.client_secret) {
    throw new Error(
      `Paymob intention failed (${res.status}): ${JSON.stringify(data)}`,
    );
  }

  return {
    intentionId: data.id as string | undefined,
    checkoutUrl: `${BASE_URL}/unifiedcheckout/?publicKey=${encodeURIComponent(
      publicKey,
    )}&clientSecret=${encodeURIComponent(data.client_secret)}`,
  };
}

// Field order mandated by Paymob for transaction-callback HMAC.
const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
];

const get = (obj: any, path: string) =>
  path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

export function verifyHmac(obj: any, received: string | null): boolean {
  if (!received) return false;
  const secret = requireEnv("PAYMOB_HMAC_SECRET");
  const concatenated = HMAC_FIELDS.map((f) => String(get(obj, f) ?? "")).join("");
  const expected = crypto
    .createHmac("sha512", secret)
    .update(concatenated)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(received.toLowerCase());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
