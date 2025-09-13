// supabase-augmented.d.ts

import type { Database as GeneratedDatabase } from "./supabase"; // your generated file

// your custom type
export interface currenciesDataType {
  currencyName: string;
  currencyCode: string;
  countryCode: string;
}

// augment the generated Database type
declare module "./supabase" {
  interface Database extends GeneratedDatabase {
    public: {
      Tables: {
        profiles: {
          Row: Omit<GeneratedDatabase["public"]["Tables"]["profiles"]["Row"], "currency"> & {
            currency: currenciesDataType | null;
          };
          Insert: Omit<GeneratedDatabase["public"]["Tables"]["profiles"]["Insert"], "currency"> & {
            currency?: currenciesDataType | null;
          };
          Update: Omit<GeneratedDatabase["public"]["Tables"]["profiles"]["Update"], "currency"> & {
            currency?: currenciesDataType | null;
          };
        };
      };
    };
  }
}
