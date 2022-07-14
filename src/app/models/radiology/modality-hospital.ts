export class ModalityHospital {
  modality_hospital_id: string;
  modality_id: string;
  modality_name: string;
  hospital_id: string;
  room_id: string;
  duration: number;
  operational_type: string;
  operational_type_name: string;
  status: string;
  modified_date: string;
  tx_modality_closes: ModalityClose[];
  readonly tx_modality_blocks: ModalityBlock[];
  tx_room_mapping: ModalityRoomMapping;
  tm_hospital: Hospital;
  readonly tx_modality_operationals: ModalityOperational[];
}

export class ModalityOperational {
  modality_operational_id: string;
  from_time: string;
  to_time: string;
  day: number;
  modality_hospital_id: string;
  status_date: string;
  created_date: string;
  is_waiting_list?: boolean;
  quota_waiting_list?: number;
  total_in_minutes?: number;
  total_used_in_minutes?: number;
  is_available?: boolean;
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

export class ModalityBlock {
  modality_block_id: string;
  modality_hospital_id: string;
  modality_operational_id: string;
  date: string;
  from_time: string;
  to_time: string;
  notes: string;
  deleted_date?: string;
  is_expired?: boolean;
}

export class ModalityRoomMapping {
  room_mapping_id: string;
  floor_name: string;
  wing_name: string;
  room_name: string;
}

export class Hospital {
  hospital_id: string;
  hospital_hope_id: number;
  name: string;
  alias: string;
}
