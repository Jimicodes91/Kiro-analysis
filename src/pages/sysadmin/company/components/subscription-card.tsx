import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { SubscriptionPlan } from "@/types/api.types";
import { Check } from "lucide-react";

function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  return (
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
  );
}

export default SubscriptionCard;
