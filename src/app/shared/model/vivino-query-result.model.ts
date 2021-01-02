export interface IVivinoQueryResult {
  hits: IVivino[];
}

export interface IVivino {
  id: number;
  vintages: IVivinoVintage[];
  statistics: IVivinoStatictics;
}

export interface IVivinoStatictics {
  ratings_count: number;
  ratings_average: number;
}

export interface IVivinoVintage {
  id: number;
  name: string;
}
