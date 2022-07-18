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

@Injectable({
  providedIn: 'root'
})
export class RadiologyService {

  constructor(public client: HttpClient) {}

  private readonly radiologyUrl = environment.OPADMIN_SERVICE + '/radiology';
  private readonly hospitalOperational = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting/hospital';
  private readonly schedule = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting';
  private readonly operationalSchedule = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting/schedules';
  private readonly modalityHospital = environment.OPADMIN_SERVICE + '/radiology/modality-hospital';

  private key: any = JSON.parse(localStorage.getItem('key')!)
  private  user = {
    userId: this.key.user.id,
    userName: this.key.user.username,
    source: 'OpAdmin',
  };

  private readonly radiologyCCUrl = environment.CALL_CENTER_SERVICE + '/radiology';
  
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

}
