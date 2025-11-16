export default function OccupancyBar({ occupied, total }) {
  const unoccupied = total - occupied;
  const occupiedPercent = (occupied / total) * 100;
  const unoccupiedPercent = (unoccupied / total) * 100;

  return (
    <div className="w-full py-2">
      <div className="w-full relative overflow-hidden flex gap-0.5">
        {/* Occupied */}
        <div
          className="flex flex-col"
          style={{ width: `${unoccupiedPercent}%` }}
        >
          {/* {unoccupied && (
            <p className="text-center text-muted-foreground font-semibold">
              {unoccupied}
            </p>
          )} */}
          <div className="h-2 w-full rounded-full bg-primary" />
        </div>
        {/* Unoccupied */}
        <div className="flex flex-col" style={{ width: `${occupiedPercent}%` }}>
          {/* {occupied && (
            <p className="text-center text-muted-foreground font-semibold">
              {occupied}
            </p>
          )} */}
          <div className="h-2 w-full rounded-full bg-destructive/70" />
        </div>
      </div>
    </div>
  );
}
