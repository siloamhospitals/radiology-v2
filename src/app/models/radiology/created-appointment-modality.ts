// note to self nanti hapus modality_label dan room_name, setelah variabel diganti ke modalityLabel dan roomName di create appointment dan function lain.
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
  modality_label?: string;
  room_name?: string;
  modalityLabel : string;
  roomName: string;
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
