import { BaseStoreRequestOperational } from './base-store-request-operational';

export default interface OperationalStoreRequest extends BaseStoreRequestOperational {

  readonly modalityOperationalId?: string;

}
