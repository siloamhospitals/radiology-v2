import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';
import { SearchPatientHopeGroupedRequest } from '../models/patients/search-patient-hope-grouped-request';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private http: HttpClient
  ) { }

  private contactUrl = environment.CALL_CENTER_SERVICE + '/contacts';
  private updateContactUrl = environment.FRONT_OFFICE_SERVICE + '/contacts/account/open-access-mr';
  private patientUrl = environment.FRONT_OFFICE_SERVICE + '/patients';
  private contactFoUrl = environment.FRONT_OFFICE_SERVICE + '/contacts';
  private patientHopeFoUrl = environment.FRONT_OFFICE_SERVICE + '/patients/hope';

  private patientHopeUrl = environment.CALL_CENTER_SERVICE + '/patients/hope';
  private verifyPatientUrl = environment.CALL_CENTER_SERVICE + '/patients/verify';
  private auditTrailsUrl = environment.CALL_CENTER_SERVICE + '/audit-trails';

  private patientHopeDetailUrl = environment.HIS_SERVICE + '/patient';
  private patientOrganizationUrl = environment.HIS_SERVICE + '/patient-organization/patient/organization';

  private uploadImageUrl = environment.UPLOAD_IMAGE + '/pdf-upload';
  private uploadDocBpjsUrl = environment.UPLOAD_IMAGE + '/bpjs/';
  private patientHopeGroupUrl = environment.CALL_CENTER_SERVICE + '/patients/hope/group';

  private searchPatientHopeSource = new Subject<any>();
  public searchPatientHopeSource$ = this.searchPatientHopeSource.asObservable();
  private updateContactSource = new Subject<boolean>();
  public updateContactSource$ = this.updateContactSource.asObservable();

  changeSearchPatientHope(params: any) {
    this.searchPatientHopeSource.next(params);
  }

  emitUpdateContact(params: boolean) {
    this.updateContactSource.next(params);
  }

  getNotesAndEmailPatient(contactId: string): Observable<any> {
    const url = `${this.contactUrl}/${contactId}`;
    return this.http.get<any>(url, httpOptions);
  }

  editNotesAndEmailPatient(payload: any, contactId: string): Observable<any> {
    const url = `${this.patientUrl}/sync/email-notes/${contactId}`;
    const body = JSON.stringify(payload);
    return this.http.put<any>(url, body, httpOptions);
  }

  getPatientHopeSearch(name: any, dob: any, phoneNumber: any, hospitalId: any): Observable<any> {
    const uri = `${this.contactFoUrl}/confirm?name=${name}&dob=${dob}&phoneNumber=${phoneNumber}&hospitalId=${hospitalId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  searchByPatientHopeId(patientHope: number, payload: any): Observable<any> {
    const url = `${this.patientHopeFoUrl}/${patientHope}`;
    const body = JSON.stringify(payload);
    return this.http.put<any>(url, body, httpOptions);
  }

  postMappingPatient(payload: any): Observable<any> {
    const uri = `${this.patientUrl}/sync`;
    const body = JSON.stringify(payload);
    return this.http.put<any>(uri, body, httpOptions);
  }

  uploadImage(formData: any) {
    const url = `${this.uploadImageUrl}`;
    return this.http.post<any>(url, formData);
  }

  uploadDocBpjs(formData: any) {
    const url = `${this.uploadDocBpjsUrl}`;
    return this.http.post<any>(url, formData);
  }

  uploadContact(payload: any) {
    const url = `${this.updateContactUrl}`;
    return this.http.put<any>(url, payload, httpOptions);
  }

  getPatientHopeDetail(patientId: number) {
    const uri = `${this.patientHopeDetailUrl}/${patientId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  getPatientHopeDetailTwo(patientId: number, orgId: any = null) {
    let uri = `${this.patientHopeDetailUrl}/details/${patientId}`;
    uri += `?organizationId=${orgId}`
    return this.http.get<any>(uri, httpOptions);
  }

  getPatientOrg(patientId: number, orgId: number) {
    const uri = `${this.patientOrganizationUrl}/${patientId}/${orgId}`;
    return this.http.get<any>(uri, httpOptions);
  }

  getAccountMobile(searchString: any, offset: any, limit: any) {
    let uri = `${this.contactFoUrl}/account/mobile`;

    if (searchString) {
      uri = `${uri}?keywords=${searchString}&limit=${limit}&offset=${offset}`;
    } else {
      uri = `${uri}?limit=${limit}&offset=${offset}`;
    }

    return this.http.get<any>(uri, httpOptions);
  }

  accountVerify(payload: any) {
    const url = `${this.contactFoUrl}/account/verify`;
    const body = JSON.stringify(payload);

    return this.http.put<any>(url, body, httpOptions);
  }

  updateContact(contactId: string, updateContactPayload: any): Observable<any> {
    const url = `${this.contactUrl}/${contactId}`;
    return this.http.put<any>(url, updateContactPayload, httpOptions);
  }

  getDefaultPatientType(patientId: any): Observable<any> {
    const uri = `${this.patientUrl}/${patientId}/default/patient-type`;
    return this.http.get<any>(uri, httpOptions);
  }

  createMrLocal(payload: any): Observable<any> {
    const url = `${this.patientUrl}/build/mr/local`;
    const body = JSON.stringify(payload);

    return this.http.post<any>(url, body, httpOptions);
  }

  searchPatientAccessMr(patientName: string, birthDate: string): Observable<any> {
    const url = `${this.patientHopeUrl}/new?patientName=${patientName}&birthDate=${birthDate}`;
    return this.http.get<any>(url, httpOptions);
  }

  searchPatientAccessMr2(hospitalId: string, localMrNo: number): Observable<any> {
    const url = `${this.patientHopeUrl}/new?hospitalId=${hospitalId}&mrLocalNo=${localMrNo}`;
    return this.http.get<any>(url, httpOptions);
  }

  searchPatientHope1(hospitalId: string, patientName: string, birthDate: string): Observable<any> {
    const url = `${this.patientHopeUrl}?hospitalId=${hospitalId}&patientName=${patientName}&birthDate=${birthDate}`;
    return this.http.get<any>(url, httpOptions);
    // return of(PATIENTHOPE);
  }

  // searchPatientGroupDob(hospitalId: string, patientName: string, birthDate: string): Observable<any> {
  //   const url = `${this.patientHopeGroupUrl}?hospitalId=${hospitalId}&patientName=${patientName}&birthDate=${birthDate}`;
  //   return this.http.get<any>(url, httpOptions);
  // }

  searchPatientHope2(hospitalId: string, localMrNo: number): Observable<any> {
    const url = `${this.patientHopeUrl}?hospitalId=${hospitalId}&mrLocalNo=${localMrNo}`;
    return this.http.get<any>(url, httpOptions);
    // return of(PATIENTHOPE);
  }

  addContact(addContactPayload: any): Observable<any> {
    const url = `${this.contactUrl}`;
    return this.http.post<any>(url, addContactPayload, httpOptions);
  }

  verifyPatient(verifyPatientPayload: any): Observable<any> {
    return this.http.post<any>(this.verifyPatientUrl, verifyPatientPayload, httpOptions);
  }

  searchPatient(name: string, birth: string, orgId?: any, ): Observable<any> {
    let url = `${this.patientUrl}/hope/name/${name}/birthdate/${birth}`;

    if (orgId) {
      url = `${url}?organizationId=${orgId}`;
    }

    return this.http.get<any>(url, httpOptions);
  }

  getContact(contactId: string): Observable<any> {
    const url = `${this.contactUrl}/${contactId}`;
    return this.http.get<any>(url, httpOptions);
  }

  createPatientComplete(payload: any) {
    const url = `${this.patientUrl}`;
    const body = JSON.stringify(payload);

    return this.http.post<any>(url, body, httpOptions);
  }

  updatePatientComplete(payload: any, patientHopeId: any) {
    const url = `${this.patientUrl}/${patientHopeId}`;
    const body = JSON.stringify(payload);

    return this.http.put<any>(url, body, httpOptions);
  }

  ModifiedLogOpenAccess(payload: any) {
    const url = `${this.auditTrailsUrl}`;
    const body = JSON.stringify(payload);

    return this.http.post<any>(url, body, httpOptions);
  }

  syncUpdatePatient(payload: any) {
    const url = `${this.patientUrl}/sync/update`;
    const body = JSON.stringify(payload);

    return this.http.post<any>(url, body, httpOptions);
  }

  createPatientByContactId(contactId: any, payload: any) {
    const url = `${this.patientUrl}/${contactId}`;
    const body = JSON.stringify(payload);

    return this.http.post<any>(url, body, httpOptions);
  }

  searchPatientHopeGroup(request: SearchPatientHopeGroupedRequest) {
    const newRequest: any = request.hospitalId && request.mrLocalNo ? {
      hospitalId: request.hospitalId,
      mrLocalNo: request.mrLocalNo,
    } : request;

    const queryParams = Object.keys(newRequest)
      .filter((e:any) => newRequest[e])
      .map((e:any) => `${encodeURIComponent(e)}=${encodeURIComponent(newRequest[e])}`)
      .join('&');
    const url = `${this.patientHopeGroupUrl}?${queryParams!}`;
    return this.http.get<any>(url, httpOptions);
  }
}
