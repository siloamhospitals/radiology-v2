import RadiologyRoom from './radiology-room';
import RadiologyTime from './radiology-time';

export default interface RadiologyItem {

  readonly modality_id: string;
  readonly modality_hospital_id: string;
  readonly modality_name: string;
  readonly modality_label: string;
  readonly operational_type: number;
  readonly operational_type_label: string;
  readonly operational_times: RadiologyTime[];
  readonly room: RadiologyRoom;
  readonly duration: number;
  readonly status: number;
  readonly status_label: string;
  readonly modified_date: Date;
  readonly modality_closes: any;
  readonly floor_name: string;

}
