import {ModalityOperational} from './modality-hospital';
import {Moment} from 'moment';
import {ModalitySlot} from './modality-slot';

export interface ModalRadiologyAppointment {

  mode: string;
  modalityHospitalId: string;
  hospitalId: string;
  isFcfs: boolean;
  date: string;
  fromTime: string;
  toTime: string;
  duration: number;
  modalityOperationalId: string;
  index: number;
  isWaitingList: boolean;
  modalityOperational?: ModalityOperational;
  slotsTaken?: { from: Moment, to: Moment }[];
  modalitySlot?: ModalitySlot;

}
