import React, { useState, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// Column Definition for the main table
type ColumnDefinition<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
};

// Column Definition for the sub-table
type SubColumnDefinition<K extends string> = {
  key: K;
  header: string;
  width?: string; // Added width property for consistency
};

// Row Data for the sub-table
type SubTableRowData = { [key: string]: string | number | boolean | null | undefined };

// Table Props
type TableProps<T, K extends keyof T> = {
  data: T[];
  columns: ColumnDefinition<T, K>[];
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  onRowClick?: (row: T) => void;
  expandable?: boolean;
  subData?: (row: T) => SubTableRowData[];
  subColumns?: (row: T) => SubColumnDefinition<string>[];
};

const Table = <T, K extends keyof T>({
  data,
  columns,
  emptyMessage = "No data available",
  className = "",
  headerClassName = "text-left p-4 font-[600] text-[14px] ",
  rowClassName = "border-b hover:bg-gray-50 text-[12px] font-[500]",
  cellClassName = "p-4",
  onRowClick,
  expandable = false,
  subData,
  subColumns,
}: TableProps<T, K>) => {
  // State to track which rows are expanded
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Ref for the container to handle synchronized scrolling
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleRowExpansion = (rowIndex: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.add(rowIndex);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="border-[1px] border-[#0000001A] p-1 rounded-lg bg-[#F7F7F7]">
      <div className={className}>
        {/* Outer container with horizontal scroll applied here */}
        <div ref={containerRef} className="overflow-x-auto">
          {/* Table container - both header and body will scroll together */}
          <div className="inline-block min-w-full">
            {/* Header table with rounded corners */}
            <div className="rounded-lg border border-[#D3D4D4] overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#EAECEC]">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={`header-${index}`}
                        className={`${headerClassName} ${column.width || ""}`}
                      >
                        {column.header}
                      </th>
                    ))}
                    {expandable && subData && subColumns && (
                      <th className={`${headerClassName} w-12`}></th> // Fixed width for action column
                    )}
                  </tr>
                </thead>
              </table>
            </div>

            {/* Body table with gap */}
            <div className="mt-2 rounded-lg border border-[#0000001A] overflow-hidden">
              <table className="min-w-full">
                <thead className="hidden">
                  {/* Hidden header to maintain column width consistency */}
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={`hidden-header-${index}`}
                        className={`${column.width || ""}`}
                      >
                        {column.header}
                      </th>
                    ))}
                    {expandable && subData && subColumns && (
                      <th className="w-12"></th> // Fixed width for action column
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((row, rowIndex) => {
                      const isExpanded = expandedRows.has(rowIndex);
                      const rowBgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]"; // Row background color

                      return (
                        <React.Fragment key={`row-${rowIndex}`}>
                          <tr
                            className={`${rowBgColor} ${rowClassName} ${isExpanded && expandable ? "border-0" : "border-b"} ${
                              onRowClick ? "cursor-pointer" : ""
                            }`}
                            onClick={() => onRowClick && onRowClick(row)}
                          >
                            {columns.map((column, colIndex) => (
                              <td
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`${cellClassName} ${column.width || ""}`}
                              >
                                {column.render
                                  ? column.render(row[column.key], row)
                                  : (row[column.key] as React.ReactNode)}
                              </td>
                            ))}
                            {expandable && subData && subColumns && (
                              <td className={`${cellClassName} w-12`}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    toggleRowExpansion(rowIndex);
                                  }}
                                  className="text-black flex justify-center w-full"
                                >
                                  {isExpanded ? (
                                    <IoIosArrowUp /> // Up arrow
                                  ) : (
                                    <IoIosArrowDown /> // Down arrow
                                  )}
                                </button>
                              </td>
                            )}
                          </tr>
                          {isExpanded && expandable && subData && subColumns && (
                            <tr className="border-0">
                              <td
                                colSpan={columns.length + 1}
                                className={`${rowBgColor} p-0`}
                              >
                                {/* Sub-table inside the expandable content */}
                                <div className="m-4 border rounded-lg overflow-hidden">
                                  <SubTable
                                    data={subData(row)}
                                    columns={subColumns(row)}
                                    parentCellClassName={cellClassName}
                                  />
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + (expandable ? 1 : 0)}
                        className="p-4 text-center text-gray-500"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Improved Sub-table Component with consistent alignment
const SubTable = ({
  data,
  columns,
  parentCellClassName = "p-4",
}: {
  data: SubTableRowData[];
  columns: SubColumnDefinition<string>[];
  parentCellClassName?: string;
}) => {
  return (
    <table className="min-w-full table-fixed">
      <thead className="border-b border-[#0000001A]">
        <tr>
          {columns.map((column, index) => (
            <th
              key={`sub-header-${index}`}
              className={`bg-[#F9F9F9] p-4 text-left ${column.width || ""}`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={`sub-row-${rowIndex}`} className="bg-white">
            {columns.map((column, colIndex) => (
              <td
                key={`sub-cell-${rowIndex}-${colIndex}`}
                className={`${parentCellClassName} ${column.width || ""}`}
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
