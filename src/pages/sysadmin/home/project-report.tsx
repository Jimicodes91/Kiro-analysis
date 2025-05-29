import { Card, CardContent } from "@/components/ui/card";
import useGetDashboardDetails from "@/hooks/admin/use-get-dashboard-details";
// import { ArrowUpRight } from "lucide-react";

interface CardDetails {
  title: string;
  count: number;
  increase?: number;
}

interface ProjectReportProps {
  onViewMore?: () => void;
}
const ProjectCard: React.FC<{ cardDetails: CardDetails }> = ({ cardDetails }) => {
  const { title, count, increase } = cardDetails;

  return (
    <Card
      className={`h-full ${increase !== undefined ? "bg-[#F3F3F3]" : "bg-[#F3F3F3]"} rounded-[6px] border border-brand-border shadow-none`}
    >
      <CardContent className="pt-5 px-4 pb-5">
        <div className="text-sm font-medium text-[#191819] mb-4">{title}</div>
        <div className="text-4xl text-[#191819] font-bold pt-6">{count}</div>
        {increase !== undefined && (
          <div
            className={`text-xs flex items-center ${increase >= 0 ? "text-[#00AA3B]" : "text-red-500"}`}
          >
            {increase >= 0 ? "↑" : "↓"} {Math.abs(increase)}%{" "}
            <span className="text-[#191819] ml-2"> increassdse from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectReport: React.FC<ProjectReportProps> = () => {
  const dashboardDetails = useGetDashboardDetails();

  const renderTableBody = () => {
    if (dashboardDetails.isPending)
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 animate-pulse">
          <div className="h-[156px] w-full rounded-lg bg-slate-200"></div>
          <div className="h-[156px] w-full rounded-lg bg-slate-200"></div>
          <div className="h-[156px] w-full rounded-lg bg-slate-200"></div>
        </div>
      );

    if (dashboardDetails?.isError) return <div></div>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <ProjectCard
          cardDetails={{
            title: "Total Projects",
            count: dashboardDetails?.value?.data?.totalProjects ?? 0,
          }}
        />
        <ProjectCard
          cardDetails={{
            title: "Total Companies",
            count: dashboardDetails?.value?.data?.totalOrganizations ?? 0,
          }}
        />
        <ProjectCard
          cardDetails={{
            title: "Total subscriptions",
            count: dashboardDetails?.value?.data?.totalActiveSubscriptions ?? 0,
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <>{renderTableBody()}</>
    </div>
  );
};

export default ProjectReport;
