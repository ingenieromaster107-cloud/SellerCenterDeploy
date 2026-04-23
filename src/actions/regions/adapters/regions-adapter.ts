import type { Region, Regions } from "src/interfaces/regions/regions-response.interface";

export function RegionAdapter(data: Regions): Region[] {
  if (!data || !('country' in data)) {
    console.warn('No found regions info');
    return [] as Region[];
  }

  return data.country.available_regions;
}
