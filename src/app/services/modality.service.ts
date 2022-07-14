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

  getModalityHospital(hospitalId: string, fromDate: any, toDate: any): Observable<any> {
    const query = `?fromDate=${fromDate}&toDate=${toDate}&hospitalId=${hospitalId}`;
    const url = this.modalityHospital + query;
    return this.http.get<any[]>(url, httpOptions);
  }
}
