export interface IAlertSMS_Create {
    max: string,
    min: string,
    name: string,
    message: string,
    phone: number[],
    method_evaluation: string,
    var_evaluation_id: number,
    waiting_next_message_time: number,
    waiting_send_first_message: number,
    equal: string,
    type_data: string,
    description: string
}

export interface IAlertSMS_Database extends IAlertSMS_Create{
    alert_id: number;
    enabled: boolean;
    erased: boolean;
}

export interface IAlertSMS_Phone{
    code: number|null,
    phone: number|null
}