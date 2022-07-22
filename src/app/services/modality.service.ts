import { RadiologyAppointmentRequest } from './../models/radiology/request/radiology-appointment-request';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions } from '../utils/http.util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalityService {

  constructor(
    private http: HttpClient
  ) { }

  private modalityHospital = environment.OPADMIN_SERVICE + '/radiology/modality-hospital';
  private modalityExamintaion = environment.OPADMIN_SERVICE + '/radiology/modality-examination';
  private appointment = environment.CALL_CENTER_SERVICE + '/radiology/modality-slot';

  getModalityHospital(hospitalId: string, fromDate: any, toDate: any): Observable<any> {
    // const query = `?fromDate=${fromDate}&toDate=${toDate}&hospitalId=${hospitalId}&operationalType='1'`;
    const query = `?fromDate=${fromDate}&toDate=${toDate}&hospitalId=${hospitalId}`;
    const url = this.modalityHospital + query;
    return this.http.get<any[]>(url, httpOptions);
  }

  getModalityExamination(modalityhospitalId: string): Observable<any> {
    const query = `?modalityHospitalId=${modalityhospitalId}`;
    const url = this.modalityExamintaion + query;
    return this.http.get<any[]>(url, httpOptions);
  }

  postAppointment(request: RadiologyAppointmentRequest): Observable<any> {
    return this.http.post<any>(this.appointment, request, httpOptions);
  }
}
