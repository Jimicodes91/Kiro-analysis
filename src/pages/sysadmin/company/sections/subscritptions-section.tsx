import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useGetAllPlans from "@/hooks/subscription/use-get-all-plans";
import { Check } from "lucide-react";
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
              className="border border-brand-border px-4 flex flex-col py-6 rounded-lg h-fit min-h-[400px] min-w-[200px]"
            >
              <div className="text-center space-y-6 flex-1">
                <div className="flex items-baseline gap-x-1 justify-center">
                  <Heading size="h3">
                    {plan?.currency}
                    {plan?.price}
                  </Heading>
                  <span className="text-md">/ seat</span>
                  <span className="text-md">/ month</span>
                </div>
                <div className="space-y-3">
                  <Heading size="h5" className="capitalize font-[900]">
                    {plan?.name}
                  </Heading>
                  <p className="text-sm">Enjoy these features</p>
                </div>
                <div>
                  <ol className="max-w-sm text-brand-light mx-auto text-left space-y-3">
                    {plan?.features?.map((feature) => (
                      <li className="flex text-sm gap-x-2">
                        <span className="h-[1lh] w-[1lh] bg-[#E4F0E3] flex items-center justify-center rounded-full flex-shrink-0">
                          <Check className="w-3 h-3 text-[#061A40]" />
                        </span>
                        {feature?.description}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div>
                <Button fullWidth size="sm" variant="outline">
                  Upgrade
                </Button>
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

      <div className="bg-white grid grid-cols-3 flex-1 gap-x-5 lg:gap-x-10 flex-wrap">
        {renderBody()}
      </div>
    </div>
  );
};

export default SysAdminCompanySubscriptionPage;
