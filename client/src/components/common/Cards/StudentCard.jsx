import { rooms } from "@/data/mock_data";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Mail, User, UserCircle } from "lucide-react";

const StudentCard = ({ student }) => {
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            {student.full_name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="font-medium">Username:</span>
          <span>{student.username}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="font-medium">Email:</span>
          <span>{student.email}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
