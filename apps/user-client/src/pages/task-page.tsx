import { BACKEND_URL } from "@/constants";
import axios from "axios";
import qs from "query-string";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SingleTask from "@/components/single-task";
import TaskCollection from "@/components/task-collection";
import { Button } from "@/components/ui/button";

type Task = {
  active: boolean;
  amount: number;
  id: number;
  options: {
    id: number;
    imageUrl: string;
    optionIndex: string;
    submissionCount: number;
    taskId: number;
  }[];
  signature: string;
  title: string;
  userId: number;
}[];
const TaskPage = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  // return;
  const [task, setTask] = useState<{
    data: Task | [];
    loading: boolean;
    error: string;
  }>({
    data: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    if (taskId) return;
    (async () => {
      const url = qs.stringifyUrl(
        {
          url: `${BACKEND_URL}/user/task`,
          query: {
            taskId: taskId,
          },
        },
        { skipNull: true }
      );
      setTask((p) => ({ ...p, loading: true }));
      try {
        const { data } = await axios.get(url, {
          headers: {
            Authorization: localStorage.getItem("web3-user-token"),
          },
        });
        setTask((p) => ({ ...p, data: data.data }));
      } catch (error: any) {
        setTask((p) => ({ ...p, error: error.response.data.message }));
      } finally {
        setTask((p) => ({ ...p, loading: false }));
      }
    })();
  }, [taskId]);
  console.log(task);
  if (taskId) {
    return <SingleTask />;
  }
  if (task.loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        loading...
      </div>
    );
  }
  if (task.error) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <p>{task.error}</p>
        <Button asChild variant="link">
          <Link to="/">Back To home</Link>
        </Button>
      </div>
    );
  }

  return <TaskCollection task={task.data} />;
};

export default TaskPage;
