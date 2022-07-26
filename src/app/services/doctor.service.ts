import { Injectable } from '@angular/core';
import { Observable, of, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DoctorHospital } from '../models/doctors/doctor-hospital';
import { Doctor } from '../models/doctors/doctor';
import { DoctorNote } from '../models/doctors/doctor-note';
import { DoctorLeave } from '../models/doctors/doctor-leave';
import { Speciality } from '../models/specialities/speciality';
import { environment } from '../../environments/environment';
import { httpOptions } from '../utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private http: HttpClient
  ) { }

  private doctorUrl = environment.OPADMIN_SERVICE + '/doctors';
  private noteCovidUrl = environment.OPADMIN_SERVICE + '/checkups';
  private scheduleUrl = environment.OPADMIN_SERVICE + '/schedules';
  private specialityUrl = environment.OPADMIN_SERVICE + '/generals/specialities';
  private internalDoctorUrl = environment.FRONT_OFFICE_SERVICE + '/generals/doctor/hospital';
  private externalDoctorUrl =  environment.FRONT_OFFICE_SERVICE + '/generals/doctor/organization';
  private externalOrganization = environment.FRONT_OFFICE_SERVICE + '/generals/organization';
  private aggregatorAndIshgReferral = environment.FRONT_OFFICE_SERVICE + '/generals/referral';

  private searchDoctorSource = new Subject<any>();
  public searchDoctorSource$ = this.searchDoctorSource.asObservable();
  public searchDoctorSource2: any;
  public goBack: any;

  getDoctorProfileTwo(hospital: string, doctor: string): Observable<any> {
    const url = `${this.doctorUrl}/profiles/hospital/${hospital}/doctor/${doctor}`;
    return this.http.get<any>(url, httpOptions);
  }

  changeSearchDoctor(params: any) {
    this.searchDoctorSource.next(params);
  }

  getDoctorQuota(hospitalId: any): Observable<any> {
    const uri = '/hospital/' + hospitalId;
    return this.http.get<DoctorHospital[]>(this.doctorUrl + uri, httpOptions);
  }

  getListDoctor(hospitalId: any): Observable<any> {
    const uri = '/lite?hospitalId=' + hospitalId;
    return this.http.get<Doctor[]>(this.doctorUrl + uri, httpOptions);
  }

  getDoctorNotes(hospital: string, fromDate: string, toDate: string, doctor?: string): Observable<any> {
    const uri = '/notes/hospital/';

    let url = this.doctorUrl + uri;
    const urlDefault = `${url}${hospital}?fromDate=${fromDate}&toDate=${toDate}`;
    url = doctor ? `${url}${hospital}?doctorId=${doctor}&fromDate=${fromDate}&toDate=${toDate}` : urlDefault;
    return this.http.get<DoctorNote[]>(url, httpOptions);
  }

  getDoctorNotesCovid(hospital: string, fromDate: string, toDate: string, checkupId?: string): Observable<any> {
    const uri = '/schedule/note/';

    const url = this.noteCovidUrl + uri;
    const urlDefault = `${url}${hospital}?checkupId=${checkupId}&fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<DoctorNote[]>(urlDefault, httpOptions);
  }

  postDoctorNotes(hospital: string, payload: any) {
    const uri = '/notes/hospital/';

    let url = this.doctorUrl + uri;
    const body = JSON.stringify(payload);
    url = `${url}${hospital}`;
    return this.http.post(url, body, httpOptions);
  }

  editDoctorNotes(hospital: string, note: string, payload: any) {
    const uri = '/notes/hospital/';

    let url = this.doctorUrl + uri;
    const body = JSON.stringify(payload);
    url = `${url}${hospital}/note/${note}`;
    return this.http.put(url, body, httpOptions);
  }

  deleteDoctorNotes(hospital: string, note: string, payload: any) {
    const uri = '/notes/hospital/';

    let url = this.doctorUrl + uri;
    const body = JSON.stringify(payload);
    url = `${url}${hospital}/note/${note}`;

    const options = {
      ...httpOptions,
      body,
    };
    return this.http.delete<any>(url, options);
  }

  getViewDoctorLeave(hospital: string, fromDate: string, toDate: string, doctor?: string): Observable<any> {
    const uri = '/leaves/hospital/';

    let url = this.doctorUrl + uri;
    const urlDefault = `${url}${hospital}?limit=10000&offset=0&fromDate=${fromDate}&toDate=${toDate}`;
    url = doctor ? `${url}${hospital}?limit=10000&offset=0&doctorId=${doctor}&fromDate=${fromDate}&toDate=${toDate}` : urlDefault;
    return this.http.get<DoctorLeave[]>(url, httpOptions);
  }

  postDoctorLeave(hospital: string, payload: any) {
    const uri = '/leaves/hospital/';

    let url = this.doctorUrl + uri;
    const body = JSON.stringify(payload);
    url = `${url}${hospital}`;
    return this.http.post(url, body, httpOptions);
  }

  editDoctorLeave(hospital: string, schedule: string, payload: any) {
    const uri = '/leaves/hospital/';

    let url = this.doctorUrl + uri;

    const body = JSON.stringify(payload);
    url = `${url}${hospital}/schedule/${schedule}`;
    return this.http.put(url, body, httpOptions);
  }

  deleteDoctorLeave(hospital: string, schedule: string, payload: any) {
    const uri = '/leaves/hospital/';

    let url = this.doctorUrl + uri;
    const body = JSON.stringify(payload);
    url = `${url}${hospital}/schedule/${schedule}`;

    const options = {
      ...httpOptions,
      body,
    };
    return this.http.delete<any>(url, options);
  }

  getDoctorProfile(hospitalId: string, doctorId: string, date?: string): Observable<any> {
    const url = `${this.doctorUrl}/hospital/${hospitalId}?doctorId=${doctorId}&hospitalId=${hospitalId}&date=${date}`;
    return this.http.get<any>(url, httpOptions);
  }

  getDoctorBySpeciality(hospitalId: string, speciality: string): Observable<any> {
    const url = `${this.doctorUrl}/lite?hospitalId=${hospitalId}&specialtyId=${speciality}`;
    return this.http.get<any>(url, httpOptions);
  }

  getScheduleByDoctorId(doctorId: string, date: string, hospitalId?: string, consultationType?: string): Observable<any> {
    // return of(SCHEDULES);
    let url = `${this.scheduleUrl}?doctorId=${doctorId}&date=${date}&hospitalId=${hospitalId}`;
    url = consultationType ? `${url}&consultationTypeId=${consultationType}` : url;
    return this.http.get<any>(url, httpOptions);
  }

  getScheduleByKeywords(
    specialityId: string,
    date: string,
    areaId?: string,
    hospitalId?: string,
    consultationType?: string
    ): Observable<any> {
    // return of(SCHEDULES2);
    let url = this.scheduleUrl;
    if (areaId) {
      url = `${this.scheduleUrl}?areaId=${areaId}&specialityId=${specialityId}&date=${date}`;
      url = consultationType ? `${url}&consultationTypeId=${consultationType}` : url;
    } else {
      url = `${this.scheduleUrl}?hospitalId=${hospitalId}&specialityId=${specialityId}&date=${date}`;
      url = consultationType ? `${url}&consultationTypeId=${consultationType}` : url;
    }
    return this.http.get<any>(url, httpOptions);
  }

  getSpecialities(specialityname?: string, _total?: number): Observable<any> {
    let url = `${this.specialityUrl}?total=all`;
    url = specialityname ? `${url}&specialityname=${specialityname}` : url;
    return this.http.get<Speciality[]>(url, httpOptions);
  }

  // paging doctor quota
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number;
    let endPage: number;

    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    // let pages = _.range(startPage, endPage + 1)

    const pages = Array.from( Array (endPage + 1 - startPage), (_ , i) => startPage + i );

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(operation, error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getInternalDoctor(hospitalId: string): Observable<any> {
    const url = `${this.internalDoctorUrl}/${hospitalId}`;
    return this.http.get<any>(url, httpOptions);
  }

  getExternalDoctor(orgId: string): Observable<any> {
    const url = `${this.externalDoctorUrl}/${orgId}`;
    return this.http.get(url, httpOptions);
  }

  getExternalOrganization(orgId: string): Observable<any> {
    const url = `${this.externalOrganization}/${orgId}`;
    return this.http.get(url, httpOptions);
  }

  getOnlineAgreggator(orgId: string): Observable<any> {
    const onlineUri = '/online-aggregator';
    const url = this.aggregatorAndIshgReferral + onlineUri;
    const urlDefault = `${url}?organizationId=${orgId}`;
    return this.http.get(urlDefault, httpOptions);
  }

  getIshg(orgId: string, doctorName: string): Observable<any> {
    const ishgUri = '/inter-shg-doctor';
    const url = this.aggregatorAndIshgReferral + ishgUri;
    const urlDefault = `${url}?organizationId=${orgId}&doctorName=${doctorName}`;
    return this.http.get(urlDefault, httpOptions);
  }
}
