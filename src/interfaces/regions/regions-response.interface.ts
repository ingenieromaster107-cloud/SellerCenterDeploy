export interface Regions {
  country:{
    available_regions: Region[];
  }
}

export interface Region {
  code: string;
  id: number;
  name: string;
}
