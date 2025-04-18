import { TableBody, TableCell, TableRow } from "./table";

const TableSkeletonRowLoader = ({
  length = 6,
  noOfRows = 5,
  isSegemented = true,
}: {
  length?: number;
  noOfRows?: number;
  isSegemented?: boolean;
}) => {
  return (
    <TableBody>
      {isSegemented && (
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={9}></TableCell>
        </TableRow>
      )}
      {Array.from({ length: noOfRows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="animate-pulse">
          {Array.from({ length }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="bg-gray-300 rounded w-full p-3.5"></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export const EmptyTable = ({
  length = 6,
  message = "No record found",
}: {
  length?: number;
  message?: string;
}) => {
  return (
    <TableBody>
      <TableRow className="animate-pulse">
        <TableCell colSpan={length}>
          <div className="py-10 text-center text-primary font-bold">{message}</div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default TableSkeletonRowLoader;
