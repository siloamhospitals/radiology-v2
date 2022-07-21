import BasicRequest from './basic-request';

export interface RadiologyRescheduleRequest extends BasicRequest {

  readonly modalitySlotId: string;
  readonly fromTime: string;
  readonly toTime: string;
  readonly reserveDate: string;
  readonly isWaitingList: boolean;
  readonly notes?: string;

}
