import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";

function ProjectEmptyStateCard() {
  return (
    <div className="h-full min-h-[calc(100vh-300px)] flex-1 w-full flex text-center justify-center items-center">
      <div className="text-center flex flex-col items-center justify-center space-y-1">
        <div className="grid place-items-center rounded-full h-16 w-16 bg-brand-primary/60">
          <Icons.project className="h-8 w-8" />
        </div>
        <Heading size="h3">No project to show yet</Heading>
        <p className="text-brand-text text-sm">
          You&apos;ve got a blank state. Add project to get started
        </p>
      </div>
    </div>
  );
}

export default ProjectEmptyStateCard;
