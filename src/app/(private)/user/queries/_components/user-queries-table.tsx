"use client";
import { Query, Property } from "@prisma/client";
import { Table } from "antd";
import dayjs from "dayjs";
import React from "react";

function UserQueriesTable({ queries }: { queries: (Query & { property: Property })[] }) {
  const columns = [
    {
      title: "Property",
      dataIndex: "property",
      render: (property: Property) => property.name,
    },
    {
      title: "Quote Amount",
      dataIndex: "quoteAmount",
      render: (quoteAmount: number) => `$ ${quoteAmount}`,
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (createdAt: string) =>
        dayjs(createdAt).format("DD MMM YYYY hh:mm A"),
    },
  ];

  return (
    <div>
      {/* Large screen table */}
      <div className="hidden md:block">
        <Table columns={columns} dataSource={queries} />
      </div>
      
      {/* Small screen cards */}
      <div className="md:hidden flex flex-col gap-4">
        {queries.map((query) => (
          <div key={query.id} className="bg-white shadow-md p-4 rounded-lg">
            <p className="text-gray-800 font-semibold">Property: {query.property.name}</p>
            <p className="text-gray-600">Quote Amount: $ {query.quoteAmount}</p>
            <p className="text-gray-600">Message: {query.message}</p>
            <p className="text-gray-600">Date: {dayjs(query.createdAt).format("DD MMM YYYY hh:mm A")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserQueriesTable;
