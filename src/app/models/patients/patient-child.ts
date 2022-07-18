import {PatientHospital} from './patient-hospital';

export interface PatientChild {

  readonly patientId: number;
  readonly patientOrganizationId: number;
  readonly organizationId: number;
  readonly name: string;
  readonly mrNo: number;
  readonly birthDate: string;
  readonly address: string;
  readonly mobileNo1?: string;
  readonly mobileNo2?: string;
  readonly emailAddress?: string;
  readonly nationalIdNo?: string;
  readonly nationalIdTypeId: string;
  readonly nationalityId: number;
  readonly patientHospitals: PatientHospital[];
  readonly contactId: string;
  readonly mergedPatientId: string;
  readonly patientHospitalsForView?: PatientHospital[];
  readonly status?: string;
  readonly nationalTypeIdName?: string;

}
