import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Bar from "@/components/common/Charts/Bar";

/*
hostel : {
  id: number,
  name: string,
}
*/

const HostelCard = ({ hostel }) => {
  // eslint-disable-next-line react-hooks/purity
  const occupiedSeats = Math.floor(Math.random() * 200); // Example data
  const totalSeats = 200; // Example data
  const totalRooms = 50; // Example data
  const warden = "John Doe"; // Example data

  return (
    <Card className="shadow-none hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-extrabold ">{hostel.name}</h1>
          <span className="font-semibold text-chart-2/70">
            Warden: {warden}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-lg">
          <span>Occupied beds:</span>
          <span className="text-right font-semibold">
            {occupiedSeats} / {totalSeats}
          </span>
          <span>Available beds: </span>
          <span className="text-right font-semibold">
            {totalSeats - occupiedSeats}
          </span>
          <span>Total rooms: </span>
          <span className="text-right font-semibold">{totalRooms}</span>
        </div>

        <Bar occupied={occupiedSeats} total={totalSeats} />
      </CardContent>
    </Card>
  );
};

export default HostelCard;
