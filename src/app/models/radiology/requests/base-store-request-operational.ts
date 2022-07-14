export interface BaseStoreRequestOperational {

  readonly modalityHospitalId: string;
  readonly fromTime: string;
  readonly toTime: string;
  readonly day: number;
  readonly userId: string;
  readonly userName: string;
  readonly isWaitingList: boolean;
  readonly quotaWaitingList?: number;
  readonly source: string;

}
