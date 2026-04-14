import type { Country, Countries } from "src/interfaces/countries/countries-response.interface";

export function CountriesAdapter(data: Countries): Country[] {
  if (!data || !('countries' in data)) {
    console.warn('No found countries info');
    return [] as Country[];
  }
  return data.countries;
}
