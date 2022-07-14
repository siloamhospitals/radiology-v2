import {BaseResponse} from './base-response';
import OperationalStoreResponse from './operational-store-response';

export interface DeleteModalityHospitalResponse extends BaseResponse {

  readonly data: OperationalStoreResponse;

}
