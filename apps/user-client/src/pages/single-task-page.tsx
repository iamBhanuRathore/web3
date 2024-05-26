import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BACKEND_URL } from "@/constants";
import axios from "axios";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
};
const SingleTaskPage = () => {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  useEffect(() => {
    (async () => {
      const url = qs.stringifyUrl(
        {
          url: `${BACKEND_URL}/user/task`,
          query: {
            taskId: params.taskId,
          },
        },
        { skipNull: true }
      );
      const { data } = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem("web3-token"),
        },
      });
      setTask(data.data[0]);
    })();
  }, []);
  return (
    <div className="h-full py-auto">
      {task ? (
        <Card className="w-4/5 m-auto">
          <CardHeader>
            <CardTitle>Title: {task?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center md:justify-between gap-10 flex-wrap">
              {task.options.map((option) => (
                <div className="group">
                  <img
                    className="w-48 h-48 border-2 group-hover:border-gray-400"
                    src={option.imageUrl}
                    alt="Task Option Image"
                  />
                  <p className="text-center text-gray-700 dark:text-gray-200">
                    Vote: {option.submissionCount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-4/5 m-auto">
          <CardHeader>
            <CardTitle className="animate-pulse">Loading ...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center md:justify-between gap-10 flex-wrap">
              {Array(4).map((_) => (
                <div className="w-48 h-48 border-2 border-gray-600 dark:border-gray-200"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SingleTaskPage;
