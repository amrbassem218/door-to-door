declare module "country-currency-map" {
  export interface CountryCurrency {
    countryCode: string;
    countryName: string;
    currencyCode: string;
    currencyName: string;
  }

  export function getAllCountries(): CountryCurrency[];
  export function getCountryByCode(code: string): CountryCurrency | undefined;
  export function getCurrencyByCode(code: string): string | undefined;
}
