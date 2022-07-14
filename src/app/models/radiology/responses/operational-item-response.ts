import RadiologyTime from '../radiology-time';

export default interface OperationalItemResponse {

  readonly modality_operational: RadiologyTime;
  readonly old_data?: RadiologyTime;
  readonly is_reschedule?: boolean;

}
