import BasicRequest from './basic-request';

export interface RadiologyAdmissionRequest extends BasicRequest {

  readonly modalitySlotId: string;
  readonly organizationId: number;
  readonly patientTypeId: number;
  readonly admissionTypeId: string;
  readonly payerId: any;
  readonly payerNo: any;
  readonly payerEligibility: any;

}
