import Filters from "@/components/filters";
import Search from "@/components/Search";// Import the new Search component
import Loader from "@/components/loader";
import { Suspense } from "react";
import PropertiesData from "./_components/properties-data";

export default async function Home({ searchParams }: { searchParams: any }) {
  const key = JSON.stringify(searchParams);

  return (
    <div>
      <Search searchParams={searchParams} /> {/* Search Bar */}
      <Filters searchParams={searchParams} /> {/* Filters */}
      <Suspense fallback={<Loader />} key={key}>
        <PropertiesData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
