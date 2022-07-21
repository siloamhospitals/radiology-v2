import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {httpOptions} from '../../utils/http.util';
import {ModalitySlotListResponse} from '../../models/radiology/responses/modality-slots-response';
import RadiologyResponse from '../../models/radiology/responses/radiology-response';
import OperationalStoreRequest from '../../models/radiology/requests/operational-store-request';
import OperationalStoreResponse from '../../models/radiology/responses/operational-store-response';
import OperationalSchedulesResponse from '../../models/radiology/responses/operational-schedules-response';
import { BaseResponse } from '../../models/radiology/responses/base-response';
import {BaseStoreRequestOperational} from '../../models/radiology/requests/base-store-request-operational';
import ModalityListResponse from '../../models/modality-response';
import ModalityHospitalListResponse from '../../models/radiology/responses/modality-hospital-response';
import {ModalityHospitalRequest} from '../../models/radiology/radiology';
import { AppointmentRadiologyHistoryResponse } from 'src/app/models/appointments/appointment-radiology-history';
import {DeleteModalitySlotRequest} from '../../models/radiology/request/delete-modality-slot-request';
import {DeleteAppointmentResponse} from '../../models/radiology/responses/delete-appointment-response';
import {ModalityExaminationResponse} from '../../models/radiology/responses/modality-examination-response';
import {RadiologyAppointmentUpdateRequest} from '../../models/radiology/requests/radiology-appointment-update-request';
import RadiologySchedulesResponse from '../../models/radiology/responses/radiology-schedule-response';

@Injectable({
  providedIn: 'root'
})
export class RadiologyService {

  constructor(public client: HttpClient) {}

  private readonly radiologyUrl = environment.OPADMIN_SERVICE + '/radiology';
  private readonly hospitalOperational = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting/hospital';
  private readonly schedule = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting';
  private readonly operationalSchedule = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting/schedules';
  private readonly radiologyCCUrl = environment.CALL_CENTER_SERVICE + '/radiology';
  private readonly modalityHospital = environment.OPADMIN_SERVICE + '/radiology/modality-hospital';
  private readonly appointment = this.radiologyCCUrl + '/modality-slot';
  private readonly modalityExamination = this.radiologyUrl + '/modality-examination';
  private readonly appointmentCCUrl = environment.CALL_CENTER_SERVICE + '/appointments';

  private key: any = JSON.parse(localStorage.getItem('key')!)
  private  user = {
    userId: this.key.user.id,
    userName: this.key.user.username,
    source: 'OpAdmin',
  };

  
  getModalitySlots(modalityHospitalId: string, reserveDate: string): Observable<ModalitySlotListResponse> {
    const url = `${this.radiologyCCUrl}/modality-slot?reserveDate=${reserveDate}&modalityHospitalId=${modalityHospitalId}`;
    return this.client.get<ModalitySlotListResponse>(url, httpOptions);
  }

  getModalitySlotsMonthly(modalityHospitalId: string, reserveIndex: string): Observable<ModalitySlotListResponse> {
    const url = `${this.radiologyCCUrl}/modality-slot/monthly?reserveDate=${reserveIndex}&modalityHospitalId=${modalityHospitalId}`;
    return this.client.get<ModalitySlotListResponse>(url, httpOptions);
  }

  getOperational(hospitalId: string, floor_id?: any, operational_type?:any, status?: any, modality_id?: any, modality_label?: any): Observable<RadiologyResponse> {
    let url = `${this.hospitalOperational}/?hospitalId=${hospitalId}`;
    url = floor_id ? `${url}&floor_id=${floor_id}` : url;
    url = operational_type ? `${url}&operational_type=${operational_type}` : url;
    url = status ? `${url}&status=${status}` : url;
    url = modality_id ? `${url}&modality_id=${modality_id}` : url;
    url = modality_label ? `${url}&modality_label=${modality_label}` : url;
    console.log(url)
    return this.client.get<RadiologyResponse>(url, httpOptions);
  }

  createOperational(payload: BaseStoreRequestOperational): Observable<OperationalStoreResponse> {
    const url = `${this.schedule}`;
    return this.client.post<OperationalStoreResponse>(url, payload, httpOptions);
  }

  updateOperational(payload: OperationalStoreRequest): Observable<OperationalStoreResponse> {
    const url = `${this.schedule}/${payload.modalityOperationalId}`;
    return this.client.put<OperationalStoreResponse>(url, payload, httpOptions);
  }

  reschedule(request: any): Observable<RadiologySchedulesResponse> {
    const url = `${this.radiologyCCUrl}/modality-slot/reschedule`;
    return this.client.post<RadiologySchedulesResponse>(url, request, httpOptions);
  }

  getOperationalSchedule(modalityHospitalId: string): Observable<OperationalSchedulesResponse> {
    const url = `${this.operationalSchedule}/${modalityHospitalId}`;
    return this.client.get<OperationalSchedulesResponse>(url, httpOptions);
  }

  deleteOperationalSchedule(modalityOperationalId: string): Observable<BaseResponse> {
    const url = `${this.schedule}/${modalityOperationalId}`;
    return this.client.request<BaseResponse>('delete', url, {
      ...httpOptions,
      body: this.user
    });
  }

  deleteModalityHospital(modalityHospitalId: string) {
    const url = `${this.modalityHospital}/${modalityHospitalId}`;

    return this.client.request<BaseResponse>('delete', url, {
      ...httpOptions,
      body: this.user
    });
  }

  getModality(params: {}): Observable<ModalityListResponse> {
    const url = `${this.radiologyUrl}/modality`;
    return this.client.get<ModalityListResponse>(url, {
      ...httpOptions,
      params,
    });
  }
  getModalityHospitalById(modalityHospitalId: any): Observable<ModalityHospitalListResponse> {
    const url = `${this.radiologyUrl}/modality-hospital/${modalityHospitalId}`;
    return this.client.get<ModalityHospitalListResponse>(url, httpOptions);
  }
  postModalityHospital(body: ModalityHospitalRequest) {
    const url = `${this.radiologyUrl}/modality-hospital`;
    return this.client.post(url, body, httpOptions);
  }
  putModalityHospital(body: ModalityHospitalRequest, modalityHospitalId: any) {
    const url = `${this.radiologyUrl}/modality-hospital/${modalityHospitalId}`;
    return this.client.put(url, body, httpOptions);
  }
  getAppRadiologyHistory(appointmentId : string): Observable<AppointmentRadiologyHistoryResponse> {
    const url = `${this.appointmentCCUrl}/radiology-history/${appointmentId}`;
    return this.client.get<AppointmentRadiologyHistoryResponse>(url, httpOptions);
  }

  deleteAppointment(modalitySlotId: string, payload: DeleteModalitySlotRequest): Observable<DeleteAppointmentResponse> {
    const url = `${this.appointment}/${modalitySlotId}`;
    return this.client.request<DeleteAppointmentResponse>('delete', url, {
      ...httpOptions,
      body: payload
    });
  }

  getModalityExaminations(modalityHospitalId: any): Observable<ModalityExaminationResponse> {
    const url = `${this.modalityExamination}?modalityHospitalId=${modalityHospitalId}`;
    return this.client.get<ModalityExaminationResponse>(url, httpOptions);
  }

  putAppointment(request: RadiologyAppointmentUpdateRequest): Observable<BaseResponse> {
    return this.client.put<BaseResponse>(`${this.appointment}/${request.modalitySlotId}`, request, httpOptions);
  }

}
