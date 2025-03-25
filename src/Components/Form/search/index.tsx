import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="bg-[#F3F3F3] p-2 rounded-full w-full h-[40px] max-w-xs flex items-center">
      <BsSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default Search;
