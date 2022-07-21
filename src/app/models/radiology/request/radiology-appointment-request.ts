export interface RadiologyAppointmentRequest {

  readonly modalityHospitalId: string;
  readonly modalityExaminationId: string;
  readonly reserveDate: string;
  readonly fromTime: string;
  readonly toTime: string;
  readonly name?: string;
  readonly birthDate?: string;
  readonly phoneNumber1?: string;
  readonly addressLine1: string;
  readonly notes?: string;
  readonly emailAddress?: string;
  readonly channelId: string;
  readonly patientHopeId: number;
  readonly isWaitingList: boolean;
  readonly contactId?: string;

  readonly userId: string;
  readonly userName: string;
  readonly source: string;

}
