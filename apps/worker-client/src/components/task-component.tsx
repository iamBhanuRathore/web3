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
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>({});
  const getNewTask = async () => {
    setloading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/worker/nextTask`, {
        headers: {
          Authorization: localStorage.getItem("web3-worker-token"),
        },
      });
      setTask(data.nextTask);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    getNewTask();
  }, []);
  const handleSubmitTask = async () => {
    if (!selectedOption.id) {
      alert("Select An Option before submitting");
      return;
    }
    setSubmitLoading(true);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/worker/postSubmission`,
        {
          taskId: selectedOption.taskId,
          optionId: selectedOption.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("web3-worker-token"),
          },
        }
      );
      console.log(data);
      getNewTask();
    } catch (error: any) {
      alert(error.response.data.message || "Internal Server Error");
    } finally {
      setSubmitLoading(false);
    }
  };
  console.log(selectedOption);
  if (loading) {
    return (
      <div className="w-full h-full flex text-3xl justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex text-3xl justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }
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
                disabled={submitLoading}
                name="taskOption"
                onClick={() => setSelectedOption(item)}
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
        <Button
          disabled={submitLoading}
          onClick={handleSubmitTask}
          variant="destructive">
          Submit
        </Button>
      </CardFooter>
    </Card>
    // </div>
  );
};

export default TaskComponent;
