import {BaseResponse} from './base-response';
import {Examination} from '../examination';

export interface ModalityExaminationResponse extends BaseResponse {

  readonly data: Examination[];
}
