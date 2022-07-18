import {MergePatientHope} from './patient-hope';
import {PatientHospital} from './patient-hospital';
import {PatientChild} from './patient-child';

export interface BasePatient {

  patientId: number;
  patientOrganizationId: number;
  organizationId: number;
  name: string;
  mrNo: number;
  mrNoUnit?: number;
  birthDate: string;
  customBirthDate?: string;
  address: string;
  mobileNo1?: string;
  mobileNo2?: string;
  emailAddress?: string;
  nationalIdNo?: string;
  nationalIdTypeId: string;
  nationalityId: number;
  isPrimary: boolean;
  mergedMrs?: MergePatientHope[];
  patientHospitals: PatientHospital[];
  patientHospitalsForView?: PatientHospital[];
  readonly mrMergeId?: string;
  isMobileAccount: boolean;
  isPatientPortalOpened?: boolean;
  mergeStatus?: string;
  requestStatus?: string;
  contactId?: string;
  contactStatusId?: string;
  readonly isCheckedForMerging?: boolean;
  readonly mobileStatus?: string | null;
  readonly isMobileIconShown?: boolean;
  readonly isLockIconShown?: boolean;
  showChildren?: boolean;
  readonly children: PatientChild[];
  nationalTypeIdName?: string;

}
