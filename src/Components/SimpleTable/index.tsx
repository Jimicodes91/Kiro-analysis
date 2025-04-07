import React from "react";

type ColumnDefinition<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
};

type TableProps<T, K extends keyof T> = {
  data: T[];
  columns: ColumnDefinition<T, K>[];
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  onRowClick?: (row: T) => void;
};

const SimpleTable = <T, K extends keyof T>({
  data,
  columns,
  emptyMessage = "No data available",
  className = "",
  headerClassName = "bg-gray-100 text-left p-4 font-[600] text-[14px]",
  rowClassName = "border-b hover:bg-gray-50 text-[12px] font-[500]",
  cellClassName = "p-4",
  onRowClick,
}: TableProps<T, K>) => {
  return (
    <div className={`overflow-x-auto rounded-lg ${className}`}>
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={`header-${index}`}
                className={`${headerClassName} ${
                  column.width ? column.width : ""
                } `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className={`${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]"
                } ${rowClassName} ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cellClassName}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : (row[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;