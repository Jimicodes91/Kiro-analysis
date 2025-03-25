import React, { useState } from "react";
import Search from "../../Components/Form/search";
import { FormSelect } from "../../Components/Form/select";
import { MainButton } from "../../Components/Form/button";
import { IoAdd } from "react-icons/io5";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search Query:", query);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between ">
        <div className="flex items-center space-x-4  mt-5 md:mt-0">
          <h1 className="text-2xl font-bold mr-5">Project</h1>
          <Search placeholder="Search keyword" onSearch={handleSearch} />
        </div>
        <div className="flex items-center space-x-4 mt-5 md:mt-0">
          <FormSelect
            label=""
            options={[
              { value: "Nigeria", label: "Nigeria Registration" },
              { value: "usa", label: "United States Registration" },
              { value: "uk", label: "United Kingdom Registration" },
              { value: "db", label: "Dubai Registration" },
            ]}
          />
          <MainButton>
            <span className="mr-3 text-xl">
              <IoAdd />
            </span>
            Add project
          </MainButton>
        </div>
      </div>
      <div className="border-[1px] border-[#0000001A] rounded-lg mt-4 ">
        
      </div>
    </div>
  );
};

export default Home;
