import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  constructor(
    private http: HttpClient
  ) { }

  private admissionUrl = environment.FRONT_OFFICE_SERVICE + '/admissions';

  getAdmissions(admission: any, contact:any): Observable<any> {
    const admissionUri = '/referral/admission-data';
    const url = this.admissionUrl + admissionUri;
    const urlDefault = `${url}?keyword=${admission}&contactId=${contact}`;
    return this.http.get(urlDefault, httpOptions);
  }

  getActiveAdmission(patientHopeId: any): Observable<any> {
    const url = `${this.admissionUrl}/active/patient/${patientHopeId}`;
    return this.http.get<any[]>(url, httpOptions);
  }

  createAdmission(payload: any): Observable<any> {

    const body = JSON.stringify(payload);
    return this.http.post<any>(this.admissionUrl, body, httpOptions);
  }

  getPatientLabel(appointmentId: string): Observable<any> {
    const url = `${this.admissionUrl}/label/appointment/${appointmentId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getPatientLabelVaccine(consentId: any): Observable<any> {
    const url = `${this.admissionUrl}/label/vaccine/${consentId}`;
    return this.http.get<any>(url, httpOptions);
  }

  createAdmissionAido(payload: any): Observable<any> {
    const url = `${this.admissionUrl}/aido`;
    const body = JSON.stringify(payload);
    return this.http.post<any>(url, body, httpOptions);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(operation, error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
