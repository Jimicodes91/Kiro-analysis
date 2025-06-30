import React from "react";

interface PaginationContextInterface {
  onNext: () => void;
  onPrev: () => void;
  changePageSize: (pageSize: number) => void;
  currentPageNumber: number;
  totalPages: number;
  isLoading?: boolean;
  pageSize: number;
  total?: number;
}

interface PaginationPropsInterface {
  children?: React.ReactNode;
  setPageProp: React.Dispatch<
    React.SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
  total: number;
  pageProp: {
    page: number;
    pageSize: number;
  };
  isLoading?: boolean;
}

const PaginationCtx = React.createContext<PaginationContextInterface>(
  {} as PaginationContextInterface
);

const PaginationContextProvider = ({
  children,
  setPageProp,
  total,
  pageProp,
  isLoading,
}: PaginationPropsInterface) => {
  const totalPages = React.useMemo(
    () => Math.ceil(total / pageProp.pageSize),
    [pageProp.pageSize, total]
  );
  const onNext = () => {
    if (total === 0) return;
    if (totalPages === pageProp.page) return;
    setPageProp((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  const onPrev = () => {
    if (pageProp.page === 1) return;
    setPageProp((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  };

  const changePageSize = (pageSize: number) => {
    setPageProp({
      pageSize,
      page: 1,
    });
  };

  return (
    <PaginationCtx.Provider
      value={{
        currentPageNumber: pageProp.page,
        onNext,
        onPrev,
        changePageSize,
        totalPages,
        isLoading,
        pageSize: pageProp.pageSize,
        total,
      }}
    >
      {children}
    </PaginationCtx.Provider>
  );
};

export const usePagination = () => {
  const context = React.useContext(PaginationCtx);

  if (context === null) {
    throw new Error("usePagination must be used within a Pagination Provider");
  }
  return context;
};

export default PaginationContextProvider;
