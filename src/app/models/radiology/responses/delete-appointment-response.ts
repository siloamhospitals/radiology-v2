import {BaseResponse} from './base-response';
import {ModalitySlot} from '../modality-slot';

export interface DeleteAppointmentResponse extends BaseResponse {
  readonly data: ModalitySlot;
}