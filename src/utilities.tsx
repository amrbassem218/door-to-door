import { supabase } from "./supabase/supabaseClient";
import type {
  CartItem,
  dbData,
  FullLocation,
  pos,
  Product,
} from "./types/types";
import { create, all } from "mathjs";
import type { User } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import { getProfile } from "./userContext";
import { loadGoogle } from "./googleLoader";

export const unitChange = (
  value: number,
  currentUnit: string,
  targetUnit: string
) => {
  const math = create(all);

  // Debug logging to see what's being passed

  targetUnit = targetUnit.toLowerCase();
  currentUnit = currentUnit.toLowerCase();
  if (targetUnit == "ton") targetUnit = "tonne";
  if (currentUnit == "ton") currentUnit = "tonne";

  const current = math.unit(value, currentUnit);
  const converted = current.to(targetUnit);
  return converted.toNumber().toFixed(6);
};

export const handleGoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

export const camel = (element: any) => {
  if (Array.isArray(element)) {
    const result = element.map((e: any, index: number) => {
      const camelized = camelcaseKeys(e, { deep: true });
      return camelized;
    });
    return result;
  } else if (typeof element === "object" && element !== null) {
    const result = camelcaseKeys(element, { deep: true });
    return result;
  }
  return element;
};

// convert snake_case to camelCase at type level
export type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<CamelCase<Tail>>}`
    : S;

// recursively apply to an object
export type Camelize<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object
    ? Camelize<T[K]>
    : T[K];
};

export const measurements = ["KG", "Grams", "Ton", "Ounces"];

export const newPrice = (
  product: Product,
  userCurrency: string,
  rates: Record<string, number>,
  quantity?: number,
  measurement?: string
) => {
  let newPriceInOriginalCurrency = product.price;
  if (product.discount > 0) {
    newPriceInOriginalCurrency -= product.price * (product.discount / 100);
  }
  let finalPrice = Number(
    convertPrice(newPriceInOriginalCurrency, userCurrency, rates)
  );
  if (quantity) {
    let commonGround = 1;
    if (measurement) {
      switch (measurement) {
        case "Ton":
          commonGround *= 1000;
          break;
        case "Grams":
          commonGround /= 1000;
          break;
        case "Ounces":
          commonGround *= 35.274;
          break;
        default:
          break;
      }
      commonGround *= quantity;

      finalPrice *= commonGround;
    }
  }
  return Number(finalPrice.toFixed(2)) ?? 0;
};
export const price = (
  product: Product,
  userCurrency: string,
  rates: Record<string, number>,
  quantity?: number,
  measurement?: string
) => {
  let productPrice = product.price ?? 0;
  if (quantity) {
    let commonGround = 1;
    if (measurement) {
      switch (measurement) {
        case "Ton":
          commonGround *= 1000;
          break;
        case "Grams":
          commonGround /= 1000;
          break;
        case "Ounces":
          commonGround *= 35.274;
          break;
        default:
          break;
      }
      commonGround *= quantity;

      productPrice *= commonGround;
    }
  }
  return Number(convertPrice(productPrice, userCurrency, rates)?.toFixed(2));
};

export const save = (
  product: Product,
  userCurrency: string,
  rates: Record<string, number>,
  quantity?: number,
  measurement?: string
) => {
  return (
    price(product, userCurrency, rates, quantity, measurement) -
    newPrice(product, userCurrency, rates, quantity, measurement)
  ).toFixed(2);
};

export const updateMes = async (product: Product, mes: string) => {
  const { error } = await supabase
    .from("cart_items")
    .update({ measurement: mes })
    .eq("product_id", product.id)
    .single();
  if (error) {
    console.log("couldn't update the mes");
    console.error(error);
  }
};
export const updateQty = async (product: Product, qty: number) => {
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity: qty })
    .eq("product_id", product.id)
    .single();
  if (error) {
    console.log("couldn't update the qty");
    console.error(error);
  }
};

export const getMes = async (user: User, product: Product, mes: string) => {
  const { error } = await supabase
    .from("cart_items")
    .select("measurement, carts!(user_id)")
    .eq("carts.user_id", user.id)
    .single();
  if (error) {
    console.log("couldn't update the mes");
    console.error(error);
  }
};
export const getQty = async (product: Product, qty: number) => {
  const { error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("product_id", product.id)
    .single();
  if (error) {
    console.log("couldn't update the qty");
    console.error(error);
  }
};

export const capetalize = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
};

async function getAddressFromLatLng(
  pos: pos | null
): Promise<string | undefined> {
  if (!pos) return;
  const lat = pos.lat;
  const lng = pos.lng;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await res.json();

  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0].formatted_address;
  } else {
    return "Unknown location";
  }
}
export const currencyToPrimaryCountry: Record<string, string> = {
  AED: "AE",
  AFN: "AF",
  ALL: "AL",
  DZD: "DZ",
  ARS: "AR",
  AUD: "AU",
  BDT: "BD",
  BGN: "BG",
  BRL: "BR",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  EGP: "EG",
  EUR: "FR",
  GBP: "GB",
  HKD: "HK",
  INR: "IN",
  JPY: "JP",
  KRW: "KR",
  MXN: "MX",
  NZD: "NZ",
  RUB: "RU",
  SAR: "SA",
  SGD: "SG",
  USD: "US",
  ZAR: "ZA",
};

export const convertPrice = (
  priceInEGP: number,
  targetCurrency: string,
  rates: Record<string, number>
) => {
  targetCurrency = targetCurrency.toLowerCase();
  // console.log("target: ", targetCurrency);
  // console.log("exists: ", Object.keys(rates).includes(targetCurrency));
  // console.log("what happens: ", rates[targetCurrency])
  if (!rates[targetCurrency]) return null;
  return Number((priceInEGP * rates[targetCurrency]).toFixed(2));
};

export const getUserCurrency = async (userId: string) => {
  const { data: userCurrency, error } = await supabase
    .from("profiles")
    .select("currency, currencies(*)")
    .eq("id", userId)
    .single();
  if (error) {
    console.log("couldn't get user currency from id");
    console.error(error);
    return null;
  }
  console.log("got user currency");
  return camel(userCurrency);
};

export const viewDate = (date: Date, separator?: string) => {
  const formatter = new Intl.DateTimeFormat("en-qz", {
    dateStyle: "full",
    timeStyle: "short",
  });
  let dateSeparator = "/";
  if (separator) dateSeparator = separator;
  const dateParts = formatter.formatToParts(date);
  const part = (p: string) => {
    return dateParts.find((e) => e.type == p)?.value;
  };
  let formattedDate =
    part("month") + dateSeparator + part("day") + dateSeparator + part("year");
  let fullDate = part("weekday")?.slice(0, 3) + " " + formattedDate;
  let time = part("hour") + ":" + part("minute");
  // console.log(datePart);
  return {
    full: fullDate + " " + time,
    dateFull: fullDate,
    date: formattedDate,
    timeFull: time + part("dayPeriod"),
    time: time,
    dateParts: dateParts,
    part: part,
  };
};

export const reverseGeo = async ({ lat, lng }: pos): Promise<FullLocation> => {
  try {
    await loadGoogle();
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      console.log("google:", window.google);
      console.log("maps:", window.google?.maps);

      geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        console.log("h2");
        if (status === "OK" && results && results[0]) {
          const comp = results[0].address_components;
          let country = comp.find((c: any) =>
            c.types.includes("country")
          )?.long_name;
          let city = comp.find(
            (c: any) =>
              c.types.includes("locality") ||
              c.types.includes("administrative_area_level_1")
          )?.long_name;
          let adress: string = results[0].formatted_address ?? "";
          if (adress.includes("+")) {
            console.log("trying over here");
            adress = adress.slice(adress.indexOf(",") + 2);
          }
          resolve({ country, city, adress });
        } else {
          reject(new Error("Geocoder failed: " + status));
        }
      });
    });
  } catch (error) {
    console.error("Failed to load Google Maps for geocoding:", error);
    throw new Error("Geocoding service unavailable");
  }
};
