export interface ICMA_ENDPOINT_CREATE {
    name: string;
    description: string;
}


export interface ICMA_ENDPOINT_CREATE_RESPONSE {
    name: string;
    description: string;
    url: string;
}


export interface ICMA_ENDPOINT_DATABASE {
    id_endpoint: number;
    name: string;
    description: string;
    token: string;
    group_socket_name: string;
    idalerta: number[];
    idblobdata: number;
}