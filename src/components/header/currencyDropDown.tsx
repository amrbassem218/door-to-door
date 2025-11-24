"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Currencies } from "@/types/types";
import { getProfile } from "@/userContext";
import * as React from "react";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import Flag from "react-world-flags";
import { defaultCurrency, getCurrencies, handleNewCurrencyClick } from "../currency/utils";
import { useRouter } from "next/navigation";
interface ICurrencyDropDownProps {}

const CurrencyDropDown: React.FunctionComponent<ICurrencyDropDownProps> = (
  props
) => {
  const [open, setOpen] = React.useState(false);
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState<Currencies>(defaultCurrency);
  const [allCurrencies, setAllCurrencies] = useState<Currencies[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (userProfile) {
      let currency = userProfile.userProfile?.currencies;
      if (currency) {
        setUserCurrency(currency);
      }
    }
  }, [userProfile]);
  useEffect(() => {
      getCurrencies(setAllCurrencies);
  }, []);
  if(!userProfile){
    router.push('/login');
    return <p>loading...</p>;
  }
  return (
    <div className="space-y-1">
      <h1 className="text-xl  font-bold">Currency</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            role="combobox"
            aria-expanded={open}
            className="w-full border-1 flex justify-between items-center p-2"
          >
            <div className="flex gap-2 items-center">
              <Flag code={userCurrency.countryCode} className="w-7 h-7" />
              <p>{userCurrency.currencyCode}</p>
            </div>
            {/* <ChevronsUpDown className="opacity-50" /> */}
            <FaAngleRight className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command>
            <CommandInput placeholder="Search Currency" className="h-9" />
            <CommandList>
              <CommandEmpty>No Currencies found.</CommandEmpty>
              <CommandGroup>
                {allCurrencies &&
                  allCurrencies.map((currency, i) => (
                    <CommandItem
                      key={`${currency.countryCode}-${currency.currencyCode}`}
                      value={currency.currencyCode}
                      onSelect={() => handleNewCurrencyClick(userProfile, setUserCurrency, currency)}
                    >
                      <div className="flex gap-2 items-center">
                        <Flag code={currency.countryCode} className="w-5 h-5" />
                        {/* TODO: Should change this to currency instead*/}
                        <p>
                          {currency.currencyName} ({currency.currencyCode})
                        </p>
                      </div>
                      {/* <Check
                      className={cn(
                        "ml-auto",
                        userCountry === country ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CurrencyDropDown;
