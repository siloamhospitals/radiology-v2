import {BaseResponse} from '../models/radiology/responses/base-response';

export function isOk(response: BaseResponse): boolean {
  return response.status === 'OK';
}

export function noop() {}
