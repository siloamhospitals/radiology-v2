export interface BaseResponse {

  readonly message: string;
  readonly status: string;

}

export interface PaginationResponse {
  readonly count: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly isLast: boolean;
}
