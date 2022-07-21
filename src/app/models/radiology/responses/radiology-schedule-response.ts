import RadiologyScheduleItem from '../radiology-schedule-item';
import {BaseResponse} from './base-response';

export default interface RadiologySchedulesResponse extends BaseResponse {

  readonly data: RadiologyScheduleItem[];

}
