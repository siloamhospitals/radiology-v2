import {BaseResponse} from './base-response';
import {ModalitySlot} from '../modality-slot';

export interface RadiologyAppointmentResponse extends BaseResponse {

  readonly data: ModalitySlot;

}
