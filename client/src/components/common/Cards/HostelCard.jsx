import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Bar from "@/components/common/Charts/Bar";

/*
hostel : {
  id: number,
  name: string,
  warden_name: string,
  total_rooms: number,
  total_capacity: number,
  occupied_beds: number,
}
*/

const HostelCard = ({ hostel }) => {
  const occupiedSeats = Number(hostel.occupied_beds) || 0;
  const totalSeats = Number(hostel.total_capacity) || 0;
  const totalRooms = Number(hostel.total_rooms) || 0;
  const availableSeats = totalSeats - occupiedSeats;

  return (
    <Card className="shadow-none hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-extrabold ">{hostel.name}</h1>
          {hostel.warden_name && (
            <span className="font-semibold text-chart-2/70">
              Warden: {hostel.warden_name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-lg">
          <span>Occupied beds:</span>
          <span className="text-right font-semibold">
            {occupiedSeats} / {totalSeats}
          </span>
          <span>Available beds: </span>
          <span className="text-right font-semibold">{availableSeats}</span>
          <span>Total rooms: </span>
          <span className="text-right font-semibold">{totalRooms}</span>
        </div>

        {totalSeats > 0 && <Bar occupied={occupiedSeats} total={totalSeats} />}
      </CardContent>
    </Card>
  );
};

export default HostelCard;
