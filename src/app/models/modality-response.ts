import { Modality } from './radiology/radiology';

export default interface ModalityListResponse {

  status: string;
  message: string;
  data: Modality[];
  last_update: string;

}
