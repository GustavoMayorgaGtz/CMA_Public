import { ChartConfiguration, ChartOptions } from "chart.js";

/**
 * Esta interfaz representa la configuracion que se crea cuando se 
 * esta definiendo una nueva line_chart (Uso en configure-linear-graph.component.ts)
 */
export interface IlineChartConfiguration {
    general: {
        title: string;
        description: string;
        idVariableJson: number | null;
        idVariableModbus: number | null;
        idVariableMemory: number | null;
        idVariableEndpoint: number|null;
        sampling_number: number;//Numero de muestreo
        isArray: boolean; //Deinir si es arreglo
        issaveblobdata: boolean; //Definir si se van a guardar los datos en un espacio virtual
        idblobdata: number|null; //Definir si se van a guardar los datos en un espacio virtual
        polling: {
            time: number; //guardar todo en segundos
            type: "sg" | "mn" | "hr"
        }
    },
    styles: {
        fill: boolean; //fill
        fill_color: string;//backgroundColor
        line: boolean; //showLine
        line_color: string;//borderColor
        line_size: number;//borderWidth
        line_tension: number;//tension
        line_stepped: boolean; //stepped
        point_style: "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle";
        point_color: string;//pointBackgroundColor
        point_border_color: string;//pointBorderColor
        point_border_size: number;//pointBorderWidth
        point_width: number;//pointWidth
    };

}

/**
 * Interfaz utilizada para mandar datos de la clase LineChart a la IU
 */
export interface getParamsLineChart {
    lineChartData: ChartConfiguration<'line'>['data'],
    lineChartOptions: ChartOptions<'line'>
}


/**
 * Interfaz utilizada para recibir todos los parametros guardados en la base de datos
 */
export interface LineChartConfigurationDatabase {
    idlinealchart: number,
    title: string,
    description: string,
    idvariablejson: number|null,
    idvariablemodbus: number|null,
    idvariablememory: number|null,
    idvariableendpoint: number|null,
    sampling_number: number,
    isarray: boolean,
    issaveblobdata: boolean,
    idblobdata: number|null,
    polling_time: number,
    polling_type: "sg"|"mn"|"hr",
    fill: boolean,
    fill_color: string,
    line: boolean,
    line_color: string,
    line_size: number,
    line_tension: number,
    line_stepped: boolean,
    point_style: "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle",
    point_color: string,
    point_border_color: string,
    point_border_size: number,
    point_width: number,
    width: number,
    height: number,
    x: number,
    y: number
}