import Loader from "@/components/ui/loader";
import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import { getUserSession } from "@/services/api.service";
import React from "react";
import EditOrganizationDetailsMain from "./org-details-main";

const EditOrganizationDetails: React.FC = () => {
  const user = getUserSession();
  const company = useGetCompanyDetails(user?.company_id ?? "");

  const renderForm = () => {
    if (company.isLoading) return <Loader />;

    if (!company.isLoading && company?.value && company?.value?.data) {
      return <EditOrganizationDetailsMain company={company?.value?.data} />;
    }
    return <p>Some thing went wrong</p>;
  };

  return (
    <div className=" flex flex-col space-y-6 pt-6 animate-in fade-in-0 duration-700 ease-in-out">
      {renderForm()}
    </div>
  );
};

export default EditOrganizationDetails;
