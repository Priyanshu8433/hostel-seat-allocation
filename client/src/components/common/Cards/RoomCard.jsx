import React from "react";
import ApplicationCard from "./ApplicationCard";
import AppStatus from "../Labels/AppStatus";
import { EllipsisVertical } from "lucide-react";

const variant = {
  Available: "approved",
  Full: "rejected",
};

const RoomCard = ({ room }) => {
  console.log("Rendering RoomCard for room:", room);
  const availableBeds = Number(room.available_beds) || 0;
  const capacity = Number(room.capacity) || 0;
  const occupiedBeds = Number(room.occupied_beds) || 0;
  const occupancyStatus = availableBeds > 0 ? "Available" : "Full";
  const tenantNames = room.tenants || [];

  return (
    <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr] text-center py-1 items-center">
      <span>{room.room_number}</span>
      <span>
        {availableBeds}/{capacity}
      </span>
      <span className="flex flex-col gap-1">
        {tenantNames.length > 0 ? (
          tenantNames.map((name, index) => <span key={index}>{name}</span>)
        ) : (
          <span className="text-muted-foreground text-sm">No tenants</span>
        )}
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
