import useGetAuditTrail from "@/hooks/project-modules/activity-logs/use-get-audit-trail";
import ActivityCard from "../components/cards/activity-card";

function ActivitLogSection({ projectId }: { projectId: string }) {
  const auditTrail = useGetAuditTrail(projectId, 1, 20);

  const renderBody = () => {
    if (auditTrail.isPending)
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              className="px-5 py-10 space-y-2 rounded-lg bg-slate-200 flex justify-between  animate-pulse"
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
      <div className="space-y-2">
        {auditTrail?.value?.data?.trails?.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div>{renderBody()}</div>
      </div>
    </>
  );
}

export default ActivitLogSection;
