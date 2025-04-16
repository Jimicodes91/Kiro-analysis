import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";

function ProjectEmptyState() {
  return (
    <div className="h-full w-full bg-gray-100 flex text-center justify-center items-center">
      <div>
        <div className="grid place-items-center h-20 w-20 bg-brand-primary/60">
          <Icons.arrow className="h-4 w-4" />
        </div>
        <Heading>No project to show yet</Heading>
        <p className="text-brand-text">
          You&apos;ve got a blank state. Add project to get started
        </p>
      </div>
    </div>
  );
}

export default ProjectEmptyState;
