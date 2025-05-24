import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./components/section-header";
// import { ArrowUpRight } from "lucide-react";

interface CardDetails {
  title: string;
  count: number;
  increase?: number;
}

interface ProjectReportProps {
  cards: CardDetails[];
  onViewMore?: () => void;
}
const ProjectCard: React.FC<{ cardDetails: CardDetails }> = ({ cardDetails }) => {
  const { title, count, increase } = cardDetails;

  return (
    <Card
      className={`h-full ${increase !== undefined ? "bg-[#E0EFDE99]" : "bg-[#F3F3F3]"} rounded-[6px] border border-[#0000001A] shadow-none`}
    >
      <CardContent className="pt-4 px-4 pb-3">
        <div className="text-sm font-medium text-[#191819] mb-6">{title}</div>
        <div className="text-4xl text-[#191819] font-bold mb-1">{count}</div>
        {increase !== undefined && (
          <div
            className={`text-xs flex items-center ${increase >= 0 ? "text-[#00AA3B]" : "text-red-500"}`}
          >
            {increase >= 0 ? "↑" : "↓"} {Math.abs(increase)}%
            <span className="ml-1 text-[#191819]">increase from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectReport: React.FC<ProjectReportProps> = ({ cards, onViewMore }) => {
  return (
    <div>
      <SectionHeader title="Project report" onViewMore={onViewMore} small={false} />
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-4">
        {cards.map((card, index) => (
          <ProjectCard key={index} cardDetails={card} />
        ))}
      </div>
    </div>
  );
};

export default ProjectReport;
