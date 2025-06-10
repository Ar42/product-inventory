import React from "react";

import clsx from "clsx";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import Spinner from "../Spinner";
import Error from "../Error";

interface SimpleTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRowClick?: (row: T) => void;
  containerClassName?: string;
}

const SimpleTable = <T,>({
  data,
  columns,
  isLoading,
  isError,
  onRowClick,
  isFetching,
  containerClassName = "",
}: SimpleTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={clsx(
        "w-full overflow-x-auto rounded-md border border-gray-200",
        containerClassName
      )}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  style={{
                    width:
                      header.getSize() !== 150 ? header.getSize() : undefined,
                    textAlign: (
                      header.column.columnDef.meta as {
                        align?: React.CSSProperties["textAlign"];
                      }
                    )?.align,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white relative">
          {(isLoading || isFetching) && (
            <tr>
              <td
                colSpan={columns.length}
                className={clsx({
                  "px-4 py-24 text-center text-sm text-gray-500": isLoading,
                })}
              >
                <Spinner
                  className={clsx({
                    "mx-auto": isLoading,
                    "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ":
                      isFetching,
                  })}
                />
              </td>
            </tr>
          )}
          {isError ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 text-center text-sm text-red-500"
              >
                Error loading data.
              </td>
            </tr>
          ) : isError === false &&
            isLoading === false &&
            data &&
            data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 text-center text-sm text-gray-500"
              >
                <Error />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer transition"
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-700"
                    style={{
                      textAlign: (
                        cell.column.columnDef.meta as {
                          align?: React.CSSProperties["textAlign"];
                        }
                      )?.align,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
