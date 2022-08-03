import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';
import ModalityListResponse from '../models/modality-response';
import ModalityHospitalListResponse from '../models/radiology/responses/modality-hospital-response';
import {ModalityHospitalRequest} from '../models/radiology/radiology';

@Injectable({
  providedIn: 'root'
})
export class RadiologyService {

  constructor(
    private http: HttpClient
  ) { }
  private radiologyUrl = environment.OPADMIN_SERVICE + '/radiology';

  getModality(params: {}): Observable<ModalityListResponse> {
    const url = `${this.radiologyUrl}/modality`;
    return this.http.get<ModalityListResponse>(url, {
      ...httpOptions,
      params,
    });
  }
  getModalityHospitalById(modalityHospitalId: any): Observable<ModalityHospitalListResponse> {
    const url = `${this.radiologyUrl}/modality-hospital/${modalityHospitalId}`;
    return this.http.get<ModalityHospitalListResponse>(url, httpOptions);
  }
  getPatientLabel(modalitySlotId: string): Observable<any> {
    const url = `${this.radiologyUrl}/admission/label/${modalitySlotId}`;
    return this.http.get<any>(url, httpOptions);
  }
  postModalityHospital(body: ModalityHospitalRequest) {
    const url = `${this.radiologyUrl}/modality-hospital`;
    return this.http.post(url, body, httpOptions);
  }
  putModalityHospital(body: ModalityHospitalRequest, modalityHospitalId: any) {
    const url = `${this.radiologyUrl}/modality-hospital/${modalityHospitalId}`;
    return this.http.put(url, body, httpOptions);
  }
}
