import { useEffect, useState } from "react";

type Rates = Record<string, number>;

export function useCurrencyRates() {
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRates = async() => {
      try {
        const url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/egp.json";
        const response = await fetch(url);
        const data = await response.json();
        setRates(data.egp);
        setLoading(false); // This is crucial - stops the infinite re-renders
      } catch (error) {
        console.error("Error fetching rates:", error);
        setLoading(false);
      }
    };
    
    fetchRates();
  }, []);
  
  return { rates, loading };
}

