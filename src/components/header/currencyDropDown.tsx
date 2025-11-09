'use client'
import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Flag from 'react-world-flags'
import { FaAngleRight } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useUser } from "@/utilities";
import { countries } from '../countries';
import { getProfile } from "@/userContext";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils";
interface ICurrencyDropDownProps {}

const CurrencyDropDown: React.FunctionComponent<ICurrencyDropDownProps> = (
  props
) => {
  const [open, setOpen] = React.useState(false)
const egypt = {code: "EG", name: "Egypt"}; 
  const [userCountry, setUserCountry] = useState(egypt);
  const [userCurrency, setUserCurrency] = useState("USD");
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
              <Flag code={userCountry.code} className="w-7 h-7" />
              <p>{userCountry.name}</p>
            </div>
            {/* <ChevronsUpDown className="opacity-50" /> */}
            <FaAngleRight className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country, i) => (
                  <CommandItem
                    key={country.name}
                    value={country.name}
                    onSelect={(currentValue) => {
                      setUserCountry(
                        currentValue === userCountry.name
                          ? userCountry
                          : countries[i]
                      );
                      setOpen(false);
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <Flag code={country.code} className="w-5 h-5" />
                      {/* TODO: Should change this to currency instead*/}
                      <p>{country.name}</p>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        userCountry === country ? "opacity-100" : "opacity-0"
                      )}
                    />
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
