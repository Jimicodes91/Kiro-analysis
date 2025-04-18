import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import useDisclosure from "@/hooks/use-disclosure";
import PipelineForm from "@/pages/Home/Admin/Project/lol";

function ProjectEmptyStateCard({ hasPipeline = true }: { hasPipeline?: boolean }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <div className="h-full min-h-[calc(100vh-300px)] flex-1 w-full flex text-center justify-center items-center">
        <div className="text-center flex flex-col items-center justify-center space-y-1">
          <div className="grid place-items-center rounded-full h-16 w-16 bg-brand-primary/60">
            <Icons.project className="h-8 w-8" />
          </div>
          <Heading size="h3">No project to show yet</Heading>
          {hasPipeline ? (
            <div>
              <p className="text-brand-text text-sm">
                You&apos;ve got a blank state. Add project to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-brand-text text-sm">
                You&apos;ve got a blank state. Create pipeline to get started
              </p>
              <Button onClick={onOpen}>Create pipeline</Button>
            </div>
          )}
        </div>
      </div>
      {isOpen && <PipelineForm onClose={onClose} />}
    </>
  );
}

export default ProjectEmptyStateCard;
