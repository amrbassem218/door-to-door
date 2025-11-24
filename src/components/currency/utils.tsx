import { supabase } from "@/supabase/supabaseClient";
import type { Currencies } from "@/types/types";
import type { UserProfileState } from "@/userContext";
import { camel } from "@/utilities";
import { toast } from "sonner";

export const getCurrencies = async (setAllCurrencies: React.Dispatch<React.SetStateAction<Currencies[]>>) => {
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
  userProfile: UserProfileState,
  setUserCurrency: React.Dispatch<React.SetStateAction<Currencies>>,
  currency: Currencies
) => {
  if (userProfile?.userProfile?.id) {
    const { error } = await supabase
      .from("profiles")
      .update({ currency: currency.id })
      .eq("id", userProfile.userProfile.id);
    if (error) {
      console.log("couldn't update currency in db");
    } else {
      const profileTemp = userProfile.userProfile;
      profileTemp.currencies = currency;
      userProfile.setUserProfile(profileTemp);
      setUserCurrency(currency);
      toast("Currency changed succssfully", {
        description: `changed language to ${currency.currencyName}`,
      });
    }
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
