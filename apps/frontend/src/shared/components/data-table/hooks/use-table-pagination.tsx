import { useMemo } from 'react';

export function useTablePagination<T>(
  data: T[],
  currentPage: number,
  pageSize: number
) {
  return useMemo(() => {
    const start =
      (currentPage - 1) * pageSize;

    return data.slice(
      start,
      start + pageSize
    );
  }, [
    data,
    currentPage,
    pageSize,
  ]);
}