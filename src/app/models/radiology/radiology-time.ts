export default interface RadiologyTime {

  readonly day: number;
  readonly from_time: string;
  readonly to_time: string;
  readonly modality_operational_id?: string;
  readonly modality_hospital_id: string;
  readonly is_waiting_list: boolean;
  readonly quota_waiting_list: number;

}
