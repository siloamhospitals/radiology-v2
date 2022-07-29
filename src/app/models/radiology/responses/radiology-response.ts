import RadiologyItem from '../radiology-item';
import {BaseResponse} from './base-response';

export default interface RadiologyListResponse extends BaseResponse {

  data: RadiologyItem[];
  last_update: string;

}
