import {BaseResponse} from './base-response';
import { ModalitySlot } from '../modality-slot';

export interface ModalitySlotListResponse  extends BaseResponse {
  data: ModalitySlot[];
}
