import {BaseResponse} from './base-response';
import {ActiveAdmission} from '../active-admission';

export interface RadiologyActiveAdmissionResponse extends BaseResponse {

  readonly data: ActiveAdmission[];

}
