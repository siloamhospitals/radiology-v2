import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { httpOptions } from '../../utils/http.util';
import RadiologyResponse from '../../models/radiology/responses/radiology-response';
import OperationalStoreRequest from '../../models/radiology/requests/operational-store-request';
import OperationalStoreResponse from '../../models/radiology/responses/operational-store-response';
import OperationalSchedulesResponse from '../../models/radiology/responses/operational-schedules-response';
import BaseResponse from '../../models/radiology/responses/base-response';
import {BaseStoreRequestOperational} from '../../models/radiology/requests/base-store-request-operational';
@Injectable({
  providedIn: 'root'
})
export class RadiologyService2 {

  constructor(
    private http: HttpClient
  ) { }

  private readonly hospitalOperational = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting/hospital';
  private readonly schedule = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting';
  private readonly operationalSchedule = environment.OPADMIN_SERVICE + '/radiology/modality-operational-setting/schedules';
  private readonly modalityHospital = environment.OPADMIN_SERVICE + '/radiology/modality-hospital';

  private readonly user = {
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('username'),
    source: 'OpAdmin',
  };

  getOperational(hospitalId: string): Observable<RadiologyResponse> {
    const url = `${this.hospitalOperational}/${hospitalId}`;
    return this.http.get<RadiologyResponse>(url, httpOptions);
  }

  createOperational(payload: BaseStoreRequestOperational): Observable<OperationalStoreResponse> {
    const url = `${this.schedule}`;
    return this.http.post<OperationalStoreResponse>(url, payload, httpOptions);
  }

  updateOperational(payload: OperationalStoreRequest): Observable<OperationalStoreResponse> {
    const url = `${this.schedule}/${payload.modalityOperationalId}`;
    return this.http.put<OperationalStoreResponse>(url, payload, httpOptions);
  }

  getOperationalSchedule(modalityHospitalId: string): Observable<OperationalSchedulesResponse> {
    const url = `${this.operationalSchedule}/${modalityHospitalId}`;
    return this.http.get<OperationalSchedulesResponse>(url, httpOptions);
  }

  deleteOperationalSchedule(modalityOperationalId: string): Observable<BaseResponse> {
    const url = `${this.schedule}/${modalityOperationalId}`;
    return this.http.request<BaseResponse>('delete', url, {
      ...httpOptions,
      body: this.user
    });
  }

  deleteModalityHospital(modalityHospitalId: string) {
    const url = `${this.modalityHospital}/${modalityHospitalId}`;

    return this.http.request<BaseResponse>('delete', url, {
      ...httpOptions,
      body: this.user
    });
  }

}
