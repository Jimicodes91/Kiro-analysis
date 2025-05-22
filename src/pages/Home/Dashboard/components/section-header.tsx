import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  onViewMore?: () => void;
  small?: boolean;
  className?: string;
}

export const SectionHeader = ({
  title,
  onViewMore,
  small = true,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={`flex justify-between items-center mb-2 ${className}`}>
      <h2 className={`text-[#191819] font-semibold ${small ? "text-base" : "text-lg"}`}>
        {title}
      </h2>
      {onViewMore && (
        <Button
          variant={"link"}
          onClick={onViewMore}
          className="text-sm text-[#191819] p-0 m-0"
        >
          View more &gt;
        </Button>
      )}
    </div>
  );
};
