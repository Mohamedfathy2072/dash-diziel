interface DoughnutChartTypes {
  half?: boolean;
  className?:string
  dataSets:number[];
  labels:string[]
}

interface LineChartTypes {
  labels: string[];
  dataPoints: number[];
}

export type { DoughnutChartTypes, LineChartTypes };
