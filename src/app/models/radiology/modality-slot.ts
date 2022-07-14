import { ModalityBlock } from './modality-hospital';
import {Slot} from './slot';
export interface ModalitySlot extends Slot {

  modality_slot_id: string;
  modality_hospital_id: string;
  modality_operational_id: string;
  hospital_id?: string;
  contact_id: string;
  modality_examination_id: string;
  doctor_id?: string;
  reserve_date: string;
  status: string;
  notes?: string;
  local_mr_no?: string;
  doctor_name?: string;
  modified_name: string;
  patient_name: string;
  patient_dob: string;
  patient_phone_number_1: string;
  patient_phone_number_2?: string;
  is_waiting_list: boolean;
  modified_date: string;
  address?: string;
  deleted_date?: string;
  admission_id?: string;
  modality_name?: string;
  modality_examination_name?: string;
  appointment_no: number;

  patient_organization_id?: number;
  patient_hope_id?: number;

  room_id?: string;
  room_name?: string;
  wing_id?: string;
  wing_name?: string;
  mapping_room_id?: string;
  floor_id?: string;
  floor_name?: string;

  is_walkin?: boolean;

  patient_visit_id?: string;
  patient_visit_number?: string;

  queue_no?: string;
  modality_queue_id?: string;
  is_expired?: boolean;

  created_name?: string;
  is_rescheduled?: boolean;

}

export class SlotList {
  modality_operational_id: string;
  modality_hospital_id: string;
  date: string;
  from_time: string;
  to_time: string;
  list: SlotItem[];
}

export class SlotItem {
  from?: string;
  to?: string;
  block?: ModalityBlock;
  patient: ModalitySlot;
  count: number;
  isSame: boolean;
}

export class RadiologySearch {
  patientName?: string;
  dob?: string;
  mrNo?: string;
  doctorName?: string;
  modalityName?: string;
  isWaiting?: string;
  modifiedBy?: string;
  to?: string;
  from?: string;
  page: string;
  show: string;
  sort?: string;
  statuses?: string[];
}
