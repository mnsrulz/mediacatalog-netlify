export interface PagedRespone<T> {
  items: T[];
  count: number;
  total: number;
  pageNumber: number;
  pageSize: number;
}
