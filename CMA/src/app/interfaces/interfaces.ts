export interface jsonLevel{
    level: number,
    name: string,
    type: string,
    value: any,
    father:{
        idx: number,
        nameFather: string,
        level: number
    }
}


import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexNonAxisChartSeries, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from "ng-apexcharts";

//-----------------------------------------
//Interfaz creada para las graficas radiales creadas con clase
export interface GraficaRadial {
    series: ApexNonAxisChartSeries,
    chart: ApexChart,
    labels: string[],
    plotOptions: ApexPlotOptions,
    fill: ApexFill,
    stroke: ApexStroke
}
//-----------------------------------------
//Interfaz creada para las graficas lineales creadas con clase
export interface GraficaLineal {
    dataLabels: ApexDataLabels,
    stroke: ApexStroke,
    series: ApexAxisChartSeries,
    chart: ApexChart,
    xaxis: ApexXAxis,
    yaxis: ApexYAxis,
    title: ApexTitleSubtitle
}

export interface randomData{
    data: number[],
    labels: string[]
}

// Interface para todas las variables  
export interface AllVar{
    idvar: number,
    name: string,
    id: number,
    type: string
  }