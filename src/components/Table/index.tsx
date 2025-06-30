import React, { JSX, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// Column Definition for the main table
export interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  width?: string;
  render?: (value: T[K], row: T) => React.ReactNode;
}

// Table Props with generics for both main table and subtable
export interface TableProps<T, K extends keyof T, S, SK extends keyof S> {
  data: T[];
  columns: ColumnDefinition<T, K>[];
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  onRowClick?: (row: T) => void;
  expandable?: boolean;
  subData?: (row: T) => S[];
  subColumns?: ColumnDefinition<S, SK>[];
  customSubTableRender?: (
    row: T,
    subData: S[],
    subColumns: ColumnDefinition<S, SK>[]
  ) => React.ReactNode;
}

// SubTable Props with proper generics
interface SubTableProps<S, SK extends keyof S> {
  data: S[];
  columns: ColumnDefinition<S, SK>[];
  cellClassName?: string;
}

// SubTable Component with proper typing
const SubTable = <S, SK extends keyof S>({
  data,
  columns,
  cellClassName = "p-4",
}: SubTableProps<S, SK>) => {
  return (
    <table className="min-w-full table-fixed">
      <thead className="border-b border-brand-border">
        <tr>
          {columns.map((column, index) => (
            <th
              key={`sub-header-${index}`}
              className={`bg-[#F9F9F9] p-4 text-left font-[600] text-[14px] ${column.width || ""}`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={`sub-row-${rowIndex}`} className="bg-white">
            {columns.map((column, colIndex) => {
              const key = column.key;
              return (
                <td
                  key={`sub-cell-${rowIndex}-${colIndex}`}
                  className={`${cellClassName} ${column.width || ""}`}
                >
                  {column.render
                    ? column.render(row[key], row)
                    : (row[key] as React.ReactNode)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Conditionally typed table component to handle both expandable and non-expandable cases
function Table<T, K extends keyof T>(
  props: Omit<
    TableProps<T, K, never, never>,
    "subData" | "subColumns" | "customSubTableRender" | "expandable"
  > & {
    expandable?: false;
  }
): JSX.Element;

function Table<T, K extends keyof T, S, SK extends keyof S>(
  props: TableProps<T, K, S, SK> & {
    expandable: true;
    subData: (row: T) => S[];
    subColumns: ColumnDefinition<S, SK>[];
  }
): JSX.Element;

function Table<T, K extends keyof T, S = never, SK extends keyof S = never>(
  props: TableProps<T, K, S, SK>
): JSX.Element {
  const {
    data,
    columns,
    emptyMessage = "No data available",
    className = "",
    headerClassName = "text-left p-4 font-[600] text-[14px] ",
    rowClassName = "border-b hover:bg-gray-50 text-[14px] font-[500] hover: cursor-pointer",
    cellClassName = "p-4 text-[14px]",
    onRowClick,
    expandable = false,
    subData,
    subColumns,
    customSubTableRender,
  } = props;

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
    <div className={className}>
      {/* Outer container with horizontal scroll applied here */}
      <div ref={containerRef} className="overflow-x-auto">
        {/* Table container - both header and body will scroll together */}
        <div className="inline-block min-w-full">
          {/* Header table with rounded corners */}
          <div className=" border border-[#D3D4D4] overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-[#EAECEC] ">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={`header-${index}`}
                      className={`${headerClassName}  ${column.width || ""}`}
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
          <div className="mt-2 rounded-lg border border-brand-border overflow-hidden">
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
                          className={`${rowBgColor} ${rowClassName} ${
                            isExpanded && expandable ? "border-0" : "border-b"
                          } ${onRowClick ? "cursor-pointer" : ""}`}
                        >
                          {columns.map((column, colIndex) => (
                            <td
                              key={`cell-${rowIndex}-${colIndex}`}
                              className={`${cellClassName} ${column.width || ""}`}
                              onClick={() => {
                                if (onRowClick) onRowClick(row);
                              }}
                            >
                              {column.render
                                ? column.render(row[column.key], row)
                                : (row[column.key] as React.ReactNode)}
                            </td>
                          ))}
                          {expandable && subData && subColumns && (
                            <td
                              className={`${cellClassName} w-12 text-center`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                toggleRowExpansion(rowIndex);
                              }}
                            >
                              <button className="text-black flex justify-center w-full">
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
                              {/* Use custom renderer if provided, otherwise use default SubTable */}
                              {customSubTableRender ? (
                                customSubTableRender(
                                  row,
                                  subData(row),
                                  subColumns as ColumnDefinition<S, SK>[]
                                )
                              ) : (
                                <div className="m-4 border rounded-lg overflow-hidden">
                                  <SubTable
                                    data={subData(row)}
                                    columns={subColumns as ColumnDefinition<S, SK>[]}
                                    cellClassName={cellClassName}
                                  />
                                </div>
                              )}
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
  );
}

export default Table;
