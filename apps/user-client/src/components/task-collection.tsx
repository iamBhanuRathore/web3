import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const TaskCollection = ({ task }: any) => {
  console.log(task);
  return (
    <div className="w-4/5 mx-auto grid grid-cols-1 gap-10 my-10 sm:grid-cols-2 md:grid-cols-3">
      {task.map((item: any) => (
        <Card>
          <CardContent>
            <Link to={`/task?taskId=${item.id}`}>
              <div>
                <p>{item.title}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskCollection;
