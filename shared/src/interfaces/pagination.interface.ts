export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
