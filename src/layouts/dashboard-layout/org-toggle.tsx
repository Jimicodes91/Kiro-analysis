import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Heading from "@/components/ui/heading";
import useGetUser from "@/hooks/user/use-get-user";
import { useOrgProjectContext } from "@/pages/Home/Project/context/org-project-context";
import { getUserSession } from "@/services/api.service";
import { ChevronDown } from "lucide-react";

export default function OrgToggle() {
  const userData = getUserSession();
  const { selectedCompanyId, changeSelectedCompanyId, isLoading } =
    useOrgProjectContext();

  const userDetails = useGetUser();
  const selectedCompanyName = userData?.companies?.find(
    (company) => company.id === selectedCompanyId
  )?.name;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isLoading}>
          {userDetails?.isPending || isLoading ? (
            <div className="h-8 min-w-[200px] bg-slate-300 animate-pulse"></div>
          ) : (
            <Heading size="h3" className="capitalize flex items-center gap-2">
              {selectedCompanyId ? selectedCompanyName : "Select Organization"}{" "}
              <ChevronDown className="inline-block size-6 text-primary" />
            </Heading>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60 rounded-lg"
          side={"bottom"}
          sideOffset={16}
          alignOffset={-10}
          align={"start"}
        >
          {userData?.companies?.map((company) => (
            <DropdownMenuItem
              key={company.id}
              className="text-sm font-medium"
              onClick={() => changeSelectedCompanyId(company.id)}
            >
              <span>{company.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
