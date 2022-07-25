import {BaseResponse} from './base-response';
import {PatientLabel} from '../patient-label';

export interface PatientLabelResponse extends BaseResponse {

  readonly data: PatientLabel;

}
