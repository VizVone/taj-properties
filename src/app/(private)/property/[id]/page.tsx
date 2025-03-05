import LinkButton from "@/components/link-button";
import prisma from "@/config/db";
import { Property } from "@prisma/client";
import React from "react";
import { Carousel } from "antd";
import QueryModal from "../_components/query-modal";

interface Props {
  params: {
    id: string;
  };
}

async function PropertyPage({ params: { id } }: Props) {
  const property: Property = (await prisma.property.findUnique({
    where: {
      id: id,
    },
  })) as Property;

  const getAttributeDetails = ({
    name,
    value,
  }: {
    name: string;
    value: any;
  }) => {
    return (
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">{name}</span>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
    );
  };

  const getSectionTitle = (title: string) => (
    <div>
      <h1 className="text-xl font-bold text-gray-700">{title}</h1>
      <hr className="border border-solid border-gray-300" />
    </div>
  );

  return (
    <div>
      <LinkButton title="Back to Properties" path="/" />

      <h1 className="text-2xl font-bold text-primary my-5">{property.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10">
        <div className="col-span-2">
          <Carousel autoplay>
            {property.images.map((image) => (
              <div key={image}>
                <img
                  src={image}
                  alt={image}
                  className="w-full h-96 lg:h-[450px] object-cover rounded-2xl"
                />
              </div>
            ))}
          </Carousel>

          <h1 className="text-2xl font-bold text-gray-700 mt-7">₹ {property.price} / {property.status}</h1>
          <br></br>
          <hr></hr>
          <p className="text-sm text-gray-600 mt-7"><b>Property Description:</b> {property.description}</p>
        </div>
        <div className="border border-solid border-gray-300 rounded-2xl p-3 sm:p-5 w-full sm:max-w-lg mx-auto">
          <div className="flex flex-col gap-1">
            {getSectionTitle("Amenities")}
            {getAttributeDetails({
              name: "Bedrooms",
              value: property.bedrooms,
            })}
            {getAttributeDetails({
              name: "Bathrooms",
              value: property.bathrooms,
            })}
            {getAttributeDetails({ name: "Parking", value: property.parking })}
            {getAttributeDetails({ name: "Area", value: property.area })}
            {getAttributeDetails({ name: "Parking", value: property.parking })}
            {getAttributeDetails({
              name: "Furnishing",
              value: property.furnishing,
            })}
            {getAttributeDetails({ name: "Floors", value: property.floors })}
            {getAttributeDetails({ name: "Age", value: property.age })}
          </div>

          <div className="flex flex-col gap-1 mt-7">
            {getSectionTitle("Address")}
            {getAttributeDetails({ name: "City", value: property.city })}
            {getAttributeDetails({
              name: "Landmark",
              value: property.landmark,
            })}
            {getAttributeDetails({ name: "Zipcode", value: property.pincode })}
            {getAttributeDetails({ name: "Address", value: property.address })}
          </div>

          {property.showOwnerContact && (
            <div className="flex flex-col gap-1 mt-7">
              {getSectionTitle("Broker/Owner Details")}
              {getAttributeDetails({
                name: "Broker or Owner",
                value: property.brokerOrOwner,
              })}
              {getAttributeDetails({
                name: "Name",
                value: property.ownerName,
              })}
              {getAttributeDetails({
                name: "Email",
                value: property.ownerEmail,
              })}
              {getAttributeDetails({
                name: "Phone",
                value: property.ownerPhone,
              })}
            </div>
          )}


          <QueryModal propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;
