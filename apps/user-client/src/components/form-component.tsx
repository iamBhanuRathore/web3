import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { createTaskSchema } from "@repo/schemas/schemas";
import { useRef, useState } from "react";
import UploadButton from "./upload-button";
import axios from "axios";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/constants";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  className?: string;
};

type FormType = z.infer<typeof createTaskSchema>;

const FormComponent = ({ className }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      signature: "Hello",
      title: "",
    },
  });
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });
  const handleRemoveImage = (index: number) => {
    remove(index);
  };

  const onSubmit = async (values: FormType) => {
    console.log(values);
    const {
      data: { data },
    } = await axios.post(
      `${BACKEND_URL}/user/task`,
      {
        ...values,
      },
      {
        headers: {
          Authorization: localStorage.getItem("web3-user-token"),
        },
      }
    );
    form.reset();
    alert("Successfully created the task");
    navigate(`/task?taskId=${data.id}`);
  };
  // console.log(form.formState.errors);
  // Function to handle file upload
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      // Map over all files and create an array of upload promises
      const allUpload = Array.from(files).map(async (file, index) => {
        try {
          // Get the presigned URL from the backend
          const response = await axios.get(`${BACKEND_URL}/user/presignedUrl`, {
            headers: {
              Authorization: localStorage.getItem("web3-user-token") || "",
            },
          });

          const { data } = response.data;
          const presignedUrl = data.url;
          const formData = new FormData();

          // Set the form data fields required by S3
          formData.set("bucket", data.fields["bucket"]);
          formData.set("X-Amz-Algorithm", data.fields["X-Amz-Algorithm"]);
          formData.set("X-Amz-Credential", data.fields["X-Amz-Credential"]);
          formData.set("X-Amz-Date", data.fields["X-Amz-Date"]);
          formData.set("key", data.fields["key"]);
          formData.set("Policy", data.fields["Policy"]);
          formData.set("X-Amz-Signature", data.fields["X-Amz-Signature"]);
          formData.set("Content-Type", "image/png");
          formData.append("file", file);

          try {
            // Upload the file to S3 using the presigned URL
            await axios.post(presignedUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            // Construct the image URL from the CloudFront URL and the key
            const imageUrl = `${CLOUDFRONT_URL}/${data.fields["key"]}`;
            append({ imageUrl, index: index + 1 });
          } catch (uploadError) {
            console.error(
              `Error uploading file ${file.name} to S3:`,
              uploadError
            );
            throw new Error(`Upload failed for file ${file.name}`);
          }
        } catch (urlError) {
          console.error("Error getting presigned URL:", urlError);
          throw new Error(`Failed to get presigned URL for file ${file.name}`);
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(allUpload);
    } catch (error) {
      console.error("Error during file upload process:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn("md:w-3/5 mx-10 md:m-auto ", className)}>
      <CardHeader className="text-3xl">
        <CardTitle className="text-center">Create a task</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-gray-300">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-300/50 border-0 rounded-lg text-black"
                      placeholder="Enter Title for the Task"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
            <UploadButton
              disabled={isUploading}
              handleFileUpload={handleFileUpload}
              ref={ref}
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Uploaded Images</h3>
              <div className="flex flex-wrap mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative m-2">
                    <img
                      src={field.imageUrl}
                      alt={`Uploaded ${index + 1}`}
                      className="w-32 h-32 object-cover border-2 border-gray-400"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 text-lg bg-red-600 text-white">
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-rose-500">
                {form.formState.errors.options?.message}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={form.formState.isSubmitting} type="submit">
              Submit Task
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default FormComponent;
