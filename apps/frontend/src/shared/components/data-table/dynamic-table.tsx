'use client';
import { useState } from 'react';

import type { DynamicTableProps, ColumnConfig } from './types';

import { DataTableAvatar } from './components/data-table-avatar';
import { DataTableStatus } from './components/data-table-status';
import { DataTableEmpty } from './components/data-table-empty';
import { DataTablePagination } from './components/data-table-pagination';
import { DataTableToolbar } from './components/data-table-toolbar';
import { DataTableActions } from './components/data-table-actions';

import { useTableFilter } from './hooks/use-table-filter';
import { useTableSort } from './hooks/use-table-sort';
import { useTablePagination } from './hooks/use-table-pagination';

import { getNestedValue } from './utils/get-nested-value';
import { formatDate } from './utils/format-date';
import { getDensityClass } from './utils/get-density-class';

export function DynamicTable<
  T extends Record<string, any>
>({
  data,
  columns,
  actions = [],

  pageSize = 10,

  density = 'normal',

  actionsMode = 'dropdown',

  stickyHeader = true,

  showToolbar = true,

  showPagination = true,

  showResultCount = true,

  emptyMessage = 'No se encontraron registros',

  onRowClick,

  className = '',
}: DynamicTableProps<T>) {
  const [searchTerm, setSearchTerm] =
    useState('');

  const [currentPage, setCurrentPage] =
    useState(1);

  const [sortConfig, setSortConfig] =
    useState<{
      key: string;
      direction: 'asc' | 'desc';
    } | null>(null);

  const filteredData =
    useTableFilter(
      data,
      columns,
      searchTerm
    );

  const sortedData = useTableSort(
    filteredData,
    columns,
    sortConfig
  );

  const paginatedData =
    showPagination
      ? useTablePagination(
          sortedData,
          currentPage,
          pageSize
        )
      : sortedData;

  const totalPages = Math.ceil(
    sortedData.length / pageSize
  );

  const densityClass =
    getDensityClass(density);

  const handleSort = (
    key: string
  ) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction:
            current.direction === 'asc'
              ? 'desc'
              : 'asc',
        };
      }

      return {
        key,
        direction: 'asc',
      };
    });
  };

  const renderCell = (
    column: ColumnConfig<T>,
    row: T
  ) => {
    const value = getNestedValue(
      row,
      column.key as string
    );

    if (column.render) {
      return column.render(
        value,
        row
      );
    }

    switch (column.type) {
      case 'avatar':
        return (
          <DataTableAvatar
            value={String(value ?? '')}
          />
        );

      case 'date':
        return formatDate(value);

      case 'status': {
        const status =
          column.statusOptions?.find(
            (s) =>
              s.value ===
              String(value)
          );

        return (
          <DataTableStatus
            label={
              status?.label ??
              String(value)
            }
            color={
              status?.color ??
              'neutral'
            }
          />
        );
      }

      case 'number':
        return typeof value ===
          'number'
          ? value.toLocaleString(
              'es-ES'
            )
          : value;

      case 'image':
        return value ? (
          <img
            src={value}
            alt=""
            className="
              h-10
              w-10
              rounded-md
              object-cover
            "
          />
        ) : (
          '-'
        );

      default:
        return value ?? '-';
    }
  };

  return (
    <div
      className={`
        overflow-hidden
        rounded-xl
        border
        bg-white
        shadow-sm
        ${className}
      `}
    >
      {showToolbar && (
        <DataTableToolbar
          searchTerm={searchTerm}
          onSearch={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />
      )}

      <div className="overflow-auto">
        <table className="w-full">
          <thead
            className={`
              bg-gray-50
              ${
                stickyHeader
                  ? 'sticky top-0 z-10'
                  : ''
              }
            `}
          >
            <tr>
              {columns.map(
                (column) => (
                  <th
                    key={String(
                      column.key
                    )}
                    onClick={() =>
                      column.sortable !==
                        false &&
                      handleSort(
                        String(
                          column.key
                        )
                      )
                    }
                    className={`
                      px-4
                      py-3
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-600
                      ${
                        column.sortable !==
                        false
                          ? 'cursor-pointer'
                          : ''
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}

                      {sortConfig?.key ===
                        column.key && (
                        <span>
                          {sortConfig.direction ===
                          'asc'
                            ? '↑'
                            : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                )
              )}

              {actions.length >
                0 && (
                <th className="w-16 px-4 py-3" />
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ===
            0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (actions.length >
                    0
                      ? 1
                      : 0)
                  }
                >
                  <DataTableEmpty
                    message={
                      emptyMessage
                    }
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map(
                (
                  row,
                  rowIndex
                ) => (
                  <tr
                    key={rowIndex}
                    onClick={() =>
                      onRowClick?.(
                        row
                      )
                    }
                    className={`
                      border-t
                      transition-colors
                      hover:bg-slate-50
                      ${
                        onRowClick
                          ? 'cursor-pointer'
                          : ''
                      }
                    `}
                  >
                    {columns.map(
                      (
                        column
                      ) => (
                        <td
                          key={String(
                            column.key
                          )}
                          className={`
                            px-4
                            ${densityClass}
                            text-sm
                          `}
                        >
                          {renderCell(
                            column,
                            row
                          )}
                        </td>
                      )
                    )}

                    {actions.length >
                      0 && (
                      <td className="px-4">
                        <DataTableActions
                          row={row}
                          actions={
                            actions
                          }
                          mode={
                            actionsMode
                          }
                        />
                      </td>
                    )}
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {(showPagination ||
        showResultCount) && (
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            px-4
            py-3
          "
        >
          {showResultCount && (
            <span
              className="
                text-sm
                text-gray-500
              "
            >
              {
                sortedData.length
              }{' '}
              resultados
            </span>
          )}

          {showPagination &&
            totalPages > 1 && (
              <DataTablePagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                onChange={
                  setCurrentPage
                }
              />
            )}
        </div>
      )}
    </div>
  );
}