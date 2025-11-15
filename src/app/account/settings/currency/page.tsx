"use client";
import type { Currencies } from "@/types/types";
import * as React from "react";

import GoBackButton from "@/components/header/goBackButton";
import { supabase } from "@/supabase/supabaseClient";
import { getProfile } from "@/userContext";
import { camel } from "@/utilities";
import { useUser } from "@/utils/getUser";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";
import { toast } from "sonner";
interface ICurrencyProps {}

const Currency: React.FunctionComponent<ICurrencyProps> = () => {
  const [currenciesData, setCurrenciesData] = useState<Currencies[]>([]);
  const userProfile = getProfile();
  const user = useUser();
  const [userCurrency, setUserCurrency] = useState<Currencies | undefined>(
    userProfile?.userProfile?.currencies
  );
  const router = useRouter();
  useEffect(() => {
    const getCurrencies = async () => {
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
          setCurrenciesData(currencies);
        }
      }
    };
    getCurrencies();
  }, []);

  const handleNewCurrencyClick = async (currency: Currencies) => {
    if (userProfile?.userProfile?.id) {
      setUserCurrency(currency);
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
        console.log("hey I got the currency here man");
        console.log("done y m3lama");
        setUserCurrency(currency);
        toast("Currency changed succssfully", {
          description: `changed language to ${currency.currencyName}`,
        });
      }
      router.back();
    }
  };
  return (
    <div className="">
      {/* Header */}
      <div className="flex px-2 gap-1 items-center pb-2 pt-3 border-b-1 shadow-sm ">
        {/* <IoIosArrowBack className="text-xl" onClick={() => navigate(-1)} /> */}
        <GoBackButton />
        <h1 className="text-lg">Currency</h1>
      </div>

      <div className="w-full  bg-gray-100 flex flex-col gap-2 py-2">
        {/* Current Currency */}
        <div className="space-y-1">
          <div className="px-2">
            <p className="text-xs text-muted">Current Currency</p>
          </div>
          <div className="w-full bg-background  px-5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag
                code={userCurrency?.countryCode ?? "US"}
                className="w-7 h-7"
              />
              <p>{userCurrency?.currencyName ?? "United States Dollar"}</p>
            </div>
            <div>
              <Check className="text-md text-primary" />
            </div>
          </div>
        </div>
        {/* More currencies */}
        {currenciesData.map((currency, i) => (
          <div
            className="space-y-1"
            onClick={() => handleNewCurrencyClick(currency)}
            key={i}
          >
            {(i === 0 ||
              (currency.currencyName &&
                currenciesData[i - 1]?.currencyName &&
                currency.currencyName[0] >
                  currenciesData[i - 1].currencyName[0])) && (
              <div className="px-2">
                <p className="text-xs text-muted">
                  {currency.currencyName?.[0] ?? ""}
                </p>
              </div>
            )}
            <button className="w-full bg-background px-5 py-2 flex items-center gap-2">
              <Flag code={currency.countryCode ?? "US"} className="w-7 h-7" />
              <p>{currency.currencyName}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Currency;
