import RadiologyTime from '../radiology-time';
import {BaseResponse} from './base-response';

export default interface OperationalSchedulesResponse extends BaseResponse {

  readonly data: RadiologyTime[];

}
