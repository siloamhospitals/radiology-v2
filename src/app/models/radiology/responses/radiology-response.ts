import RadiologyItem from '../radiology-item';
import {BaseResponse} from './base-response';

export default interface RadiologyListResponse extends BaseResponse {

  readonly data: RadiologyItem[];
  last_update: string;

}
