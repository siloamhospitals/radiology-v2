import { ModalityHospital } from '../radiology';
import {BaseResponse} from './base-response';

export default interface ModalityHospitalListResponse  extends BaseResponse {
  data: ModalityHospital;
}
