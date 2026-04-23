export interface Cities {
  regionCities: {
    items: City[];
  }
}

export interface City {
  id: string;
  code: string;
  name: string;
}