import { TablePagination } from "@/components/ui/table-pagination";
import useGetCompanyAuditTrail from "@/hooks/audit-trail/use-get-company-audit-trails";
import PaginationContextProvider from "@/lib/context/pagination-context";
import { groupEntriesByTimePeriod } from "@/lib/utils";
import React from "react";
import ActivityCard from "../../project-details/components/cards/activity-card";

// Define types for our audit trail entries

// Group header type

const AuditTrailTab = () => {
  const [pageProp, setPageProp] = React.useState({
    page: 1,
    pageSize: 10,
  });
  const auditTrail = useGetCompanyAuditTrail(pageProp.page, pageProp.pageSize);

  // Function to group entries by time period

  const groupedEntries = groupEntriesByTimePeriod(auditTrail?.value?.data?.trails || []);

  const renderBody = () => {
    if (auditTrail?.status === "pending")
      return (
        <div className="space-y-2 page-fade-in">
          {Array.from(Array(pageProp.pageSize)).map((_, index) => (
            <div
              className="px-5 py-14  space-y-2 rounded-lg bg-slate-100 flex justify-between  animate-pulse"
              key={index}
            ></div>
          ))}
        </div>
      );

    if (auditTrail?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (auditTrail?.value?.data?.trails?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No activity currently on this project
          </p>
        </div>
      );

    return (
      <>
        {Object.entries(groupedEntries).map(([groupName, entries]) => (
          <div key={groupName} className="w-full page-fade-in">
            {/* Time group header with divider line */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute border-t border-brand-border w-full"></div>
              <div className="relative px-4 py-1 bg-white text-[#191819] border-brand-border font-semibold text-sm rounded-full border z-10">
                {groupName}
              </div>
            </div>

            {/* Entries in this time group */}
            <div className="space-y-2">
              <div className="space-y-2">
                {entries?.map((activity) => (
                  <ActivityCard activity={activity} key={activity.id} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-base font-semibold pt-2">Audit trail</h1>

      <div className="py-10">{renderBody()}</div>

      <PaginationContextProvider
        pageProp={pageProp}
        setPageProp={setPageProp}
        total={auditTrail.value?.data?.pagination?.total ?? 0}
      >
        <TablePagination />
      </PaginationContextProvider>
    </div>
  );
};

export default AuditTrailTab;
