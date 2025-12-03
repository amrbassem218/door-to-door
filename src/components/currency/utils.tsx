import { supabase } from "@/supabase/supabaseClient";
import type { Currencies } from "@/types/types";
import { camel } from "@/utilities";
import { toast } from "sonner";

export const getAllCurrencies = async (
  setAllCurrencies: React.Dispatch<React.SetStateAction<Currencies[]>>
) => {
  let { data: currencies, error } = await supabase
    .from("currencies")
    .select("*");
  if (error) {
    console.log("couldn't get all currencies");
    console.error(error);
  } else {
    console.log("got em");
    console.log();
    currencies = camel(currencies);
    if (currencies) {
      currencies.sort((a, b) => {
        return a.currencyName.localeCompare(b.currencyName);
      });
      setAllCurrencies(currencies);
    }
  }
};

export const handleNewCurrencyClick = async (
  userId: string | null,
  setUserCurrency: React.Dispatch<React.SetStateAction<Currencies>>,
  newCurrency: Currencies
) => {
  if (userId) {
    const { error } = await supabase
      .from("profiles")
      .update({ currency: newCurrency.id })
      .eq("id", userId);
    if (error) {
      console.log("couldn't update currency in db");
    } else {
      setUserCurrency(newCurrency);
      toast("Currency changed succssfully", {
        description: `changed language to ${newCurrency.currencyName}`,
      });
    }
  }
  else{
      setUserCurrency(newCurrency);
      toast("Currency changed succssfully", {
        description: `changed language to ${newCurrency.currencyName}`,
      });
  }
};
// TODO: FIX THE RATES
export const defaultCurrency = {
  id: 1,
  createdAt: "2025-08-27 11:16:05.461142+00",
  currencyName: "US Dollar",
  currencyCode: "USD",
  countryCode: "US",
  countryName: "United States",
  rateToEgp: "48.5",
};
