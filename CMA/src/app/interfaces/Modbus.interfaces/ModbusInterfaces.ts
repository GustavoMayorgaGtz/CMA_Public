export interface IModbusVar_Create {
    name: string,
    ip: string,
    port: string,
    no_register: string
}

export interface IModbusVar_Test {
    ip: string,
    port: string,
    no_register: string
}
export interface IModbusVar {
    idmodbusvar: number,
    name: string,
    ip: string,
    port: string,
    no_register: string
    value: number[]
}

export interface IMemoryVar{
    idmemoryvar: number,
    name: string,
    expression: string,
    result: number
}