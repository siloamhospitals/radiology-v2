import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {httpOptions} from '../../utils/http.util';
import {ModalitySlotListResponse} from '../../models/radiology/responses/modality-slots-response';

@Injectable({
  providedIn: 'root'
})
export class RadiologyService {

  constructor(public client: HttpClient) {}

  private readonly radiologyCCUrl = environment.CALL_CENTER_SERVICE + '/radiology';
  
  getModalitySlots(modalityHospitalId: string, reserveDate: string): Observable<ModalitySlotListResponse> {
    const url = `${this.radiologyCCUrl}/modality-slot?reserveDate=${reserveDate}&modalityHospitalId=${modalityHospitalId}`;
    return this.client.get<ModalitySlotListResponse>(url, httpOptions);
  }

}
