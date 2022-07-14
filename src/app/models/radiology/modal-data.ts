import RadiologyTime from './radiology-time';

export default interface ModalData {

  operationalId?: string;
  radiologyTimes?: RadiologyTime[];
  modalityHospitalId?: string;
  operationalType?: string;

}
