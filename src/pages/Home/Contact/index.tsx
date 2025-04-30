import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useGetAllContacts from "@/hooks/contacts/use-get-all-contacts";
import React, { useState } from "react";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import ContactEmptyState from "./contact-empty-state";
import ContactsTable from "./contact-table";

const Contact: React.FC = () => {
  const [, setSearchQuery] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    // setIsModalOpen(true);
  };

  const contactsResponse = useGetAllContacts();

  return (
    <>
      <div className="mx-6 my-2">
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-4">
            <Heading size="h3">Contact</Heading>
            <div className="relative w-full min-w-[300px] bg-[#F3F3F3] rounded-full">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3 text-[#808080]" />
              <Input
                placeholder="Search keyword"
                className="w-full pl-8 text-[#00000080]"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />}
              className="border-black"
            >
              Filter
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<GoShare className="text-[#111] w-6 h-6" />}
              className="border-black"
            >
              Export
            </Button>
            <Button
              size="sm"
              leftIcon={<IoAdd className="text-white w-6 h-6" />}
              onClick={handleAddContact}
            >
              Add contact
            </Button>
          </div>
        </div>
        {Array.isArray(contactsResponse?.data?.data) &&
        contactsResponse?.data?.data?.data?.length === 0 ? (
          <ContactEmptyState />
        ) : (
          <ContactsTable />
        )}
      </div>

      {/* Contact Modal for creating new contacts */}
      {/* {isModalOpen && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="create"
        />
      )} */}
    </>
  );
};

export default Contact;
