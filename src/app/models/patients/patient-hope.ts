import {BasePatient} from './base-patient';
import {PatientHospital} from './patient-hospital';

export interface PatientHope {
  patientId: number;
  patientOrganizationId: number;
  organizationId: number;
  name: string;
  mrNo: number;
  mrNoUnit: number;
  birthDate: string;
  address: string;
  mobileNo1: string;
  mobileNo2: string;
  patientStatusId: number;
  medicalRecordStatusId: number;
}

export interface MergePatientHope {
  patientId: number;
  patientOrganizationId?: number;
  organizationId: number;
  name?: string;
  mrNo: number;
  mrNoUnit?: number;
  birthDate: string;
  address?: string;
  mobileNo1: string;
  mobileNo2: string;
  patientStatusId: number;
  medicalRecordStatusId?: number;
  emailAddress: string;
  nationalIdNo?: string;
  nationalityId?: number;
  nationalIdTypeId?: string;
  isPrimary: boolean;
  requestMergedId: string;
  mrMergeId: string;
  mergeStatus: string;
  requestStatus: string;
  mergedTo: number;
  patientHospitals: PatientHospital[];
  patientHospitalsForView?: PatientHospital[];
  isMobileAccount: boolean;
  contactId?: string;
  isPatientPortalOpened?: boolean;
  status?: string;
  nationalTypeIdName?: string;
}

export interface NewPatientHope extends BasePatient {

  patientStatusId: string;
  medicalRecordStatusId: number;
  requestMergedId: string;
  mergedTo?: number;

}
