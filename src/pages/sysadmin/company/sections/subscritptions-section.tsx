import Heading from "@/components/ui/heading";
import useGetAllPlans from "@/hooks/subscription/use-get-all-plans";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SysAdminCompanySubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const allPlans = useGetAllPlans();

  const renderBody = () => {
    if (allPlans.isSuccess && allPlans.value) {
      return (
        <>
          {allPlans?.value?.data?.map((plan) => (
            <div
              key={plan?.name}
              className="border border-brand-border px-4 py-6 rounded-lg"
            >
              <div className="text-center space-y-6">
                <div className="flex items-baseline gap-x-2 justify-center">
                  <Heading size="h3">
                    {plan?.currency}
                    {plan?.price}
                  </Heading>
                  <span className="text-lg"> / seat</span>
                  <span className="text-lg">/ month</span>
                </div>
                <div className="space-y-3">
                  <Heading size="h5" className="capitalize font-semibold">
                    {plan?.name}
                  </Heading>
                  <p>Enjoy these features</p>
                </div>
                <div>
                  <ol className="max-w-sm text-center text-brand-light mx-auto space-y-3">
                    {plan?.features?.map((feature) => <li>{feature?.description}</li>)}
                  </ol>
                </div>
              </div>
            </div>
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

      <div className="bg-white grid grid-cols-3 flex-1 gap-x-7">{renderBody()}</div>
    </div>
  );
};

export default SysAdminCompanySubscriptionPage;
