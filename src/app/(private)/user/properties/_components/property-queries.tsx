import { GetQueriesByPropertId } from "@/actions/queriest";
import { Property, Query } from "@prisma/client";
import { Modal, Table, message } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";

interface Props {
  showQueriesModal: boolean;
  setShowQueriesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProperty: Property | null;
}

function PropertyQueries({
  showQueriesModal,
  setShowQueriesModal,
  selectedProperty,
}: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [queries, setQueries] = React.useState<Query[]>([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response: any = await GetQueriesByPropertId(
          selectedProperty?.id || ""
        );
        if (response.error) throw new Error(response.error);
        setQueries(response.data);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProperty) fetchQueries();
  }, []);

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
    },
    {
      title: "Customer Mobile",
      dataIndex: "phoneNumber",
    },
    {
      title: "Quote Amount",
      dataIndex: "quoteAmount",
      render: (quoteAmount: number) => `₹ ${quoteAmount}`,
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
    <Modal
      title={`Queries for ${selectedProperty?.name}`}
      open={showQueriesModal}
      onCancel={() => setShowQueriesModal(false)}
      width={1000}
      footer={null}
    >
      <div className="p-4">
        {/* Table for large screens */}
        <div className="hidden md:block">
          <Table columns={columns} dataSource={queries} loading={loading} />
        </div>

        {/* Card layout for small screens */}
        <div className="md:hidden space-y-4">
          {queries.map((query) => (
            <div key={query.id} className="border p-4 rounded-lg shadow-md bg-white">
              <p className="font-semibold">Customer: {query.name}</p>
              <p className="text-gray-600 text-sm">Mobile: {query.phoneNumber}</p>
              <p className="text-gray-600 text-sm">Quote Amount: $ {query.quoteAmount}</p>
              <p className="text-gray-600 text-sm">Message: {query.message}</p>
              <p className="text-gray-600 text-sm">Date & Time: {dayjs(query.createdAt).format("DD MMM YYYY hh:mm A")}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default PropertyQueries;
