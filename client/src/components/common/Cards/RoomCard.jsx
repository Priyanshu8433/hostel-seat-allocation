import React from "react";
import ApplicationCard from "./ApplicationCard";
import AppStatus from "../Labels/AppStatus";
import { EllipsisVertical } from "lucide-react";

const variant = {
  Available: "approved",
  Full: "rejected",
};

const RoomCard = ({ room }) => {
  // eslint-disable-next-line react-hooks/purity
  const availableBeds = Math.floor(Math.random() * (room.capacity + 1));
  const occupancyStatus = availableBeds > 0 ? "Available" : "Full";
  const tenantNames = ["Alice", "Bob"];
  return (
    <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr] text-center py-1 items-center">
      <span>{room.room_number}</span>
      <span>
        {availableBeds}/{room.capacity}
      </span>
      <span className="flex flex-col gap-1">
        {tenantNames.map((name, index) => (
          <span key={index}>{name}</span>
        ))}
      </span>

      <AppStatus
        variant={variant[occupancyStatus]}
        text={occupancyStatus}
        className="w-32 mx-auto"
      />

      <div className="flex justify-end px-4">
        <div className="hover:bg-muted rounded-full p-2 cursor-pointer">
          <EllipsisVertical />
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
