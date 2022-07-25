import {BaseResponse} from './base-response';

export interface LateResponse extends BaseResponse {

  readonly data: Late;

}

export interface Late {

  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;

}
