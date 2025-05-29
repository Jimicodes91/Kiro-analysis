import Heading from "@/components/ui/heading";
import useGetAllPlans from "@/hooks/subscription/use-get-all-plans";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import SubscriptionCard from "../components/subscription-card";

const SysAdminCompanySubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const allPlans = useGetAllPlans();

  const renderBody = () => {
    if (allPlans.isSuccess && allPlans.value) {
      return (
        <>
          {allPlans?.value?.data?.map((plan) => (
            <SubscriptionCard plan={plan} key={plan.id} />
          ))}
        </>
      );
    }

    if (allPlans.isError && allPlans.error) {
      return <p>Something went wrong</p>;
    }
    return (
      <>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-full min-h-full w-full rounded-lg bg-slate-200 animate-pulse"
          ></div>
        ))}
      </>
    );
  };
  return (
    <div className="p-8 h-full space-y-6 flex flex-col min-h-[calc(100vh-70px)] max-w-[1400px]">
      <div>
        <div className="mb-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-dark hover:text-[#191819B2] transition-colors"
          >
            <IoArrowBack className="mr-2" />
            Company Information
          </button>
          <Heading size="h3">Subscription plan</Heading>
        </div>
      </div>

      <div className="bg-white grid grid-cols-3 flex-1 gap-x-5 lg:gap-x-10 flex-wrap">
        {renderBody()}
      </div>
    </div>
  );
};

export default SysAdminCompanySubscriptionPage;
