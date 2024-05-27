import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import { Card, CardHeader, CardTitle } from "./ui/card";
const TaskComponent = () => {
  const [task, setTask] = useState<any>();
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${BACKEND_URL}/worker/nextTask`, {
        headers: {
          Authorization: localStorage.getItem("web3-worker-token"),
        },
      });
      setTask(data.nextTask);
    })();
  }, []);
  console.log(task);
  return (
    <div className="h-full w-full flex items-stretch py-10">
      <Card className="w-3/5 mx-auto">
        <CardHeader>
          <CardTitle className="text-center capitalize">
            {task?.title}
          </CardTitle>
          {task?.options.map((item: any) => (
            <div>
              <label>
                <img src={item.imageUrl} />
              </label>
              <input type="radio" name="taskOption" id="" />
            </div>
          ))}
        </CardHeader>
      </Card>
    </div>
  );
};

export default TaskComponent;
