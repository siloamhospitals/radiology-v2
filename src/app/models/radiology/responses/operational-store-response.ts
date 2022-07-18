import {BaseResponse} from './base-response';
import OperationalItemResponse from './operational-item-response';

export default interface OperationalStoreResponse extends BaseResponse {

  readonly data: OperationalItemResponse;

}
