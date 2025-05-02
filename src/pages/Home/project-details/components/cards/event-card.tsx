import Heading from "@/components/ui/heading";
import { MdGpsFixed } from "react-icons/md";

function EventCard() {
  return (
    <div className="px-5 py-3 space-y-2 rounded-lg border flex gap-x-4 items-center border-brand-border bg-[#F8F8F8]">
      <div className="min-h-[140px] px-12 flex flex-col justify-center items-center bg-[#D9D9D94D] border border-brand-border rounded-lg">
        <p className="">June</p>
        <Heading size="h1">21</Heading>
      </div>
      <div>
        <p className="text-sm">11:00am - 2:00pm</p>
        <p className="font-bold text-xl">Planning & Strategy</p>
        <p className="text-gray-500 max-w-lg tex-sm">
          Define relocation objectives, Set budget and timeline, Assign project manager &
          key stakeholders
        </p>
        <div className="flex gap-2 items-center pt-1">
          <MdGpsFixed />
          <p>Armani Hotel Dubai</p>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
