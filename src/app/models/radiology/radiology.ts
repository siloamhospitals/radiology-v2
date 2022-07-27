import { RoomMapping } from '../room-mapping';

export class ModalityHospital {
  modality_hospital_id: string;
  modality_id: string;
  modality_name: string;
  modality_label: string;
  hospital_id: string;
  room_id: string;
  duration: string;
  operational_type: string;
  operational_type_name: string;
  status: string;
  modified_date: string;
  tx_modality_closes: ModalityClose[];
  tx_room_mapping: RoomMapping;
  notes: string;
  modality_notes: string;
  room_name: string
}
export class ModalityClose {
  modality_close_id: string;
  modality_hospital_id: string;
  from_date: string;
  to_date: string;
  from_time: string;
  to_time: string;
  notes: string;
}
export class ModalityHospitalRequest {
  modalityId: string;
  modalityLabel: string;
  roomId: string;
  hospitalId: string;
  duration: string;
  operationalType: string;
  status: string;
  userId: string;
  source: string;
  userName: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  notes: string;
  modality_notes: string;
}
export class Modality {
  modality_id: string;
  code: string;
  name: string;
}
export class FixedList{
  id: string;
  name: string;
}