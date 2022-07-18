export interface BaseRequest {

  readonly userId: string;
  readonly userName: string;
  readonly source: string;
  readonly channelId?: string | null;

}
