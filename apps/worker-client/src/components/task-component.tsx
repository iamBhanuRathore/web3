import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
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
  return (
    // <div className="h-full w-full flex items-stretch py-10">
    <Card className="w-3/5 mx-auto">
      <CardHeader>
        <CardTitle className="text-center capitalize">{task?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-10 justify-between">
          {task?.options.map((item: any, ind: any) => (
            <div key={ind}>
              <input
                className="peer hidden"
                type="radio"
                name="taskOption"
                id={ind}
              />
              <label
                className="peer-checked:border-red-900 cursor-pointer hover:border-red-500 border-transparent border-2 peer-checked:shadow-lg peer-checked:shadow-red-500 overflow-hidden block w-40 h-40 relative"
                htmlFor={ind}>
                <img
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src={item.imageUrl}
                />
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="destructive">Submit</Button>
      </CardFooter>
    </Card>
    // </div>
  );
};

export default TaskComponent;
