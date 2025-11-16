import { Card, CardContent } from "./card";

const StatCard = ({ title, description, icon: Icon, value }) => {
  return (
    <Card className="min-w-fit w-full overflow-hidden flex flex-col justify-center py-8">
      <CardContent className="flex justify-between items-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-medium text-muted-foreground">
            {title}
          </h1>
          {/* <p>{description}</p> */}
          <span className="text-4xl font-extrabold">{value}</span>
        </div>
        <Icon size={72} className="opacity-25" />
      </CardContent>
    </Card>
  );
};

export default StatCard;
