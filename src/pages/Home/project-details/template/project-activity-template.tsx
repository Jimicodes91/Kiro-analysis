import { TablePagination } from "@/components/ui/table-pagination";
import useGetAuditTrail from "@/hooks/project-modules/activity-logs/use-get-audit-trail";
import PaginationContextProvider from "@/lib/context/pagination-context";
import { groupEntriesByTimePeriod } from "@/lib/utils";
import React from "react";
import ActivityCard from "../components/cards/activity-card";

function ActivitLogSection({ projectId }: { projectId: string }) {
  const [pageProp, setPageProp] = React.useState({
    page: 1,
    pageSize: 10,
  });
  const auditTrail = useGetAuditTrail(projectId, pageProp.page, pageProp.pageSize);

  const groupedEntries = groupEntriesByTimePeriod(auditTrail?.value?.data?.trails || []);

  const renderBody = () => {
    if (auditTrail.isPending)
      return (
        <div className="space-y-2">
          {Array.from(Array(pageProp.pageSize)).map((i) => (
            <div
              className="px-5 py-10 space-y-2 rounded-lg bg-gray-100 flex justify-between  animate-pulse"
              key={i}
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
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div>{renderBody()}</div>
        <PaginationContextProvider
          pageProp={pageProp}
          setPageProp={setPageProp}
          total={auditTrail.value?.data?.pagination?.total ?? 0}
        >
          <TablePagination />
        </PaginationContextProvider>
      </div>
    </>
  );
}

export default ActivitLogSection;
