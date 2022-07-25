import {BaseResponse} from './base-response';
import {ModalityAdmission} from '../modality-admission';

export interface ModalityAdmissionResponse extends BaseResponse {

  readonly data: ModalityAdmission;

}
