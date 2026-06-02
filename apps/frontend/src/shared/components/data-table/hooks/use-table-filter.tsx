'use client';
import { useMemo } from 'react';
import { ColumnConfig } from '../types';

function getNestedValue(
  obj: any,
  path: string
) {
  return path
    .split('.')
    .reduce((acc, part) => acc?.[part], obj);
}

export function useTableFilter<T>(
  data: T[],
  columns: ColumnConfig<T>[],
  searchTerm: string
) {
  return useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        if (column.searchable === false)
          return false;

        const value = getNestedValue(
          row,
          column.key as string
        );

        return String(value ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [data, columns, searchTerm]);
}