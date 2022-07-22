export class AddedModality {
  modalityHospitalId: string;
  modalityExaminationId?: string;
  reserveDate: any;
  notes?: string;
  isBpjs?: boolean;
  isAnesthesia?: boolean;
  fromTime?: string;
  toTime: string;
  duration: number;
  modality_label : string;
  room_name: string;
}

export class EditedModality {
  modalityHospitalId: string;
  modalityExaminationId?: string;
  reserveDate: any;
  notes?: string;
  isBpjs?: boolean;
  isAnesthesia?: boolean;
  fromTime?: string;
  toTime: string;
}
