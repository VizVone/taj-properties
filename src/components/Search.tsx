"use client";
import { Button, Input } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

function Search({ searchParams }: { searchParams: any }) {
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const newSearchParams = { ...searchParams };

    if (searchTerm.trim() === "") {
      delete newSearchParams.search;
    } else {
      newSearchParams.search = searchTerm.trim();
    }

    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-3 md:p-5 border rounded-2xl border-solid border-gray-300 mb-5 items-center mt-5 gap-3">
      {/* Search Input */}
      <Input
        className="w-full md:w-auto border-gray-300 rounded-xl px-4 py-2"
        placeholder="City Name, Landmark Name, Property Name, Property Price"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onPressEnter={handleSearch} // Pressing enter triggers search
      />

      {/* Search Button */}
      <Button type="primary" className="px-6 py-2 rounded-xl" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
}

export default Search;
