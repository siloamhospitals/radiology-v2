import BasicRequest from './basic-request';

export interface DeleteModalitySlotRequest extends BasicRequest {
  readonly note?: string;
}