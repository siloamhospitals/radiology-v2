import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { httpOptions } from '../utils/http.util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayerService {

  constructor(
    private http: HttpClient
  ) { }

  private payerUrl = environment.FRONT_OFFICE_SERVICE;
  private urlInhealth =  environment.INHEALTH + '/reprint';

  public searchReferralSource = new Subject<any>();

  public searchDiagnose: any = new Subject<any>();
  public searchDiagnose$: any = this.searchDiagnose.asObservable();

  checkEligible(payload: any): any {
    const url = `${this.payerUrl}/payer-portal`;
    return this.http.post<any>(url, payload, httpOptions);
  }

  getListRefferal(payload: any): any {
    const url = `${this.payerUrl}/payer-portal/list-referral`;
    return this.http.post<any>(url, payload, httpOptions);
  }

  getDeaseClasification(payload: any): any {
    const url = `${this.payerUrl}/generals/disease-classification`;
    return this.http.post<any>(url, payload, httpOptions);
  }

  getPrint(payload: any): any {
    // const url = `${this.payerUrl}/payer-portal/reprint`
    return this.http.post<any>(this.urlInhealth, payload, httpOptions);
  }

  changeReferralSource(params: any): any {
    this.searchReferralSource.next(params);
  }

  changeDiagnose(params: any): any {
    this.searchDiagnose.next(params);
  }

  updateAdmission(payload: any): any {
    const url = `${this.payerUrl}/payer-portal/update`;
    return this.http.put<any>(url, payload, httpOptions);
  }

}

