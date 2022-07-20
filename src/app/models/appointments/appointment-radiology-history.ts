import { BaseResponse } from '../base/base-response'

export  class AppointmentRadiologyHistory {
    appointment_radiology_history_id : string;
    appointment_id : string;
    status : string; 
    content : string; 
    created_by : string; 
    created_at : Date;
}

export  interface AppointmentRadiologyHistoryResponse extends BaseResponse {
    data: AppointmentRadiologyHistory[];
}

