import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { AnimatePresence } from "framer-motion";
import React, {
    // useEffect,
    useState,
} from "react";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import ContactModal from "./contact-modal-form";
import ContactsTable from "./contact-table";

const Contact: React.FC = () => {
  const [search, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceText = useDebounce(search, 1000);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Heading size="h3">Contacts</Heading>
            <div className="relative flex-1 sm:flex-initial sm:min-w-[200px] md:min-w-[300px] bg-[#F3F3F3] rounded-full">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3 text-[#808080]" />
              <Input
                placeholder="Search keyword"
                className="w-full pl-8 text-[#00000080]"
                type="search"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              size="sm"
              leftIcon={<IoAdd className="text-white w-6 h-6" />}
              onClick={handleAddContact}
            >
              Add contact
            </Button>
          </div>
        </div>

        <ContactsTable search={debounceText} />
      </div>

      {/* Contact Modal for creating new contacts */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isModalOpen && (
          <ContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode="create"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Contact;
