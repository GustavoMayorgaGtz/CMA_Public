//Esta informacion sirve para crear o actualizar desde el cliente
export interface IBlobData {
   idblobdata: number,
   value: number,
   date: string
}

//Esta informacion viene del servidor
export interface IBlobData_Database {
   idblobdata: number,
   value: number[],
   register_date: string[],
   description: string
}

//Esta informacion sirve para graficar en tabla
export interface IBlobData_Table {
   valor: number;
   fecha: string;
}