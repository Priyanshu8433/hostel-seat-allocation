import StudentCard from "@/components/common/Cards/StudentCard";
import { Separator } from "@/components/common/Separator/separator";
import { users } from "@/data/mock_data";

const page = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col mb-3">
        <span className="text-3xl font-extrabold text-foreground">
          Students
        </span>
        <span className="font-medium text-muted-foreground text-lg">
          Manage student information and availability
        </span>
      </div>

      <Separator className="mb-5" />

      {/* Content */}
      <div>
        {users
          .filter((user) => user.role === "student")
          .map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
      </div>
    </div>
  );
};

export default page;
