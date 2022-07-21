import ModalityClose from './modality-close';
import {ModalityOperational} from './modality-hospital';

export default interface RadiologyScheduleItem {

  readonly modality_label: string;
  readonly modality_hospital_id: string;
  readonly modality_id: string;
  readonly room_id: string;
  readonly room_name: string;
  readonly hospital_id: string;
  readonly duration: number;
  readonly status: string;
  readonly operational_type_name: string;
  readonly operational_type: string;
  readonly modality_closes: ModalityClose[];
  readonly modality_operationals: ModalityOperational[];

}
