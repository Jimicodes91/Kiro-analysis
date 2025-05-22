import { usePagination } from "@/lib/context/pagination-context";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export function TablePagination() {
  const {
    onNext,
    onPrev,
    currentPageNumber,
    totalPages,
    changePageSize,
    pageSize,
    total,
  } = usePagination();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        Showing page {currentPageNumber} of {totalPages} • Total {total} contacts
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs">Rows per page:</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              changePageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={currentPageNumber === 1}
          className="text-xs"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentPageNumber === totalPages}
          className="text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
