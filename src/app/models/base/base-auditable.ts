export interface BaseAuditable {

  readonly created_by: string;
  readonly created_date: string;
  readonly created_name: string;
  readonly created_from: string;
  readonly modified_by: string;
  readonly modified_date: string;
  readonly modified_name: string;
  readonly modified_from: string;

}
