import {BaseResponse} from './base-response';
import { ModalitySlot } from '../modality-slot';

export interface ModalitySlotListResponse  extends BaseResponse {
  data: ModalitySlot[];
}

export interface ModalitySlotListPaginationResponse  extends BaseResponse {
  data: {
    rows : ModalitySlot[];
    count: number
    currentPage: string
    isLast: boolean
  }
}