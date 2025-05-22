import Heading from "@/components/ui/heading";
import React from "react";
import CompaniesTable from "./components/companies-table";
import ProjectReport from "./project-report";

const SysAdminHomePage: React.FC = () => {
  interface CardDetail {
    title: string;
    count: number;
    increase?: number;
    status?: string;
  }

  const projectCards: CardDetail[] = [
    { title: "Total Projects", count: 250, increase: 10 },
    { title: "Total Companies", count: 50, increase: 10 },
    { title: "Total subscriotions", count: 50, increase: 10 },
  ];

  const handleViewMoreProjectReport = () => {
    console.log("View more project report clicked");
  };

  return (
    <div>
      <div className="mx-6 my-2">
        <div className="flex justify-between items-center my-4">
          <Heading size="h3">Home</Heading>
        </div>
        <ProjectReport cards={projectCards} onViewMore={handleViewMoreProjectReport} />
        <div className="grid grid-cols-1 pt-4">
          <div className="bg-white rounded-[6px] border space-y-4 border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
            <Heading size="h4">Company</Heading>
            <CompaniesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SysAdminHomePage;
