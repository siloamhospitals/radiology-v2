import {BaseResponse} from '../base/base-response';
import {NewPatientHope} from './patient-hope';

export interface SearchPatientDataResponse extends BaseResponse {

  readonly data: NewPatientHope[];

}
