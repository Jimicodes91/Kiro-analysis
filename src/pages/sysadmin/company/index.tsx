import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useGetCompanyDetails from "@/hooks/admin/use-get-company";
import useGetCompanySubscription from "@/hooks/subscription/use-get-company-subscription-plan";
import useDisclosure from "@/hooks/use-disclosure";
import UsersTable from "@/pages/Home/Admin/user/user-table";
import ProjectDetailSkeleton from "@/pages/Home/project-details/components/project-skeleton";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddUserModalForm from "../subscriptions/add-user-model-form";

const SysAdminCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const { companyId } = useParams<{ companyId: string }>();
  const company = useGetCompanyDetails(companyId ?? "");
  const companyDetails = company?.value?.data;
  useGetCompanySubscription(companyId ?? "");
  if (company.isError && company.error) {
    return <p>Something went wrong</p>;
  }

  if (company.isSuccess && company.value) {
    return (
      <div className="p-3 sm:p-4 md:p-6 h-full space-y-6 flex flex-col min-h-[calc(100vh-70px)] animate-in fade-in-0 duration-700 ease-in-out">
        <div>
          <div className="mb-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-dark hover:text-[#191819B2] transition-colors"
            >
              <IoArrowBack className="mr-2" />
              Home
            </button>
            <Heading size="h3">Company Information</Heading>
          </div>
        </div>

        <div className="bg-white grid grid-cols-1 md:grid-cols-auth-layout flex-1 gap-x-5">
          <div className="p-4 min-h-full flex-1 h-max space-y-4 rounded-lg border border-brand-border">
            <div className="space-y-6">
              <Heading size="h5" className="capitalize">
                {companyDetails?.name}
              </Heading>
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs text-brand-light font-[500]">Email</h3>
                  <p className="text-sm text-gray-900">Orizondigital@yahoo.com</p>
                </div>
                <div>
                  <h3 className="text-xs text-brand-light font-[500]">Status</h3>

                  <Badge variant={companyDetails?.is_active ? "success" : "destructive"}>
                    <span>{companyDetails?.is_active ? "Active" : "Inactive"}</span>
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xs text-brand-light font-[500]">Created date</h3>
                  <p className="text-sm text-gray-900">
                    {format(companyDetails?.created_at ?? "", "PPP")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs text-brand-light font-[500]">Activated date</h3>
                  <p className="text-sm text-gray-900">03 Apr 2025</p>
                </div>
                <div>
                  <h3 className="text-xs text-brand-light font-[500]">Industry Type</h3>
                  <p className="text-sm text-gray-900 capitalize">
                    {companyDetails?.industry_type}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 md:pt-0 h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-4">
            <div className="rounded-lg w-full p-4 border border-brand-border">
              <div className="space-y-6">
                <Heading size="h5">Subscription plan</Heading>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3  min-w-max md:min-w-[400px] justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xs text-brand-light font-[500]">
                        Current plan
                      </h3>
                      <p className="text-sm text-gray-900">Premium</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs text-brand-light font-[500]">Price/Seat</h3>
                      <p className="text-sm text-gray-900">$50/User</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs text-brand-light font-[500]">
                        Number of user
                      </h3>
                      <p className="text-sm text-gray-900">10</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs text-brand-light font-[500]">
                        Total per month
                      </h3>
                      <p className="text-sm text-gray-900">$500</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="outline">
                      Cancel
                    </Button>
                    <Button size="sm">
                      <Link to={`/sysadmin/${companyDetails?.id}/companies/subscription`}>
                        Upgrade
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg w-full h-full border border-brand-border p-4">
              <div className="space-y-3 grid grid-cols-1">
                <div className="flex justify-between items-center">
                  <h1 className="text-[16px] font-[600]">Company user </h1>
                  <Button
                    size="sm"
                    leftIcon={<LuPlus className="text-white" />}
                    onClick={onOpen}
                  >
                    Add user
                  </Button>
                </div>
                <UsersTable isEditable={false} givenCompanyId={companyDetails?.id} />
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
          {isOpen && <AddUserModalForm isOpen={isOpen} onClose={onClose} />}
        </AnimatePresence>
      </div>
    );
  }
  return <ProjectDetailSkeleton />;
};

export default SysAdminCompanyPage;
