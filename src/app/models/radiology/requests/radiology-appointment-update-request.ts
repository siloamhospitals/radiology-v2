export interface RadiologyAppointmentUpdateRequest {

  readonly modalityHospitalId: string;
  readonly modalityOperationalId: string;
  readonly modalityExaminationId: string;
  readonly modalitySlotId: string;
  readonly notes: string;

  readonly userId: string;
  readonly userName: string;
  readonly source: string;

}
