import type { City, Cities } from "src/interfaces/cities/cities-response.interface";

export function CitiesAdapter(data: Cities): City[] {
  if (!data || !('regionCities' in data)) {
    console.warn('No found cities info');
    return [] as City[];
  }

  return data.regionCities.items;
}
