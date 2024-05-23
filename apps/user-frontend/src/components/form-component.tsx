import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  //   CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  //   useFormField,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { cn } from "@repo/ui/lib/utils";
import z from "zod";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "../../../../packages/schemas/schemas";
import { Button } from "@repo/ui/components/ui/button";
import { useRef } from "react";
type Props = {
  className?: string;
};
type FormType = z.infer<typeof createTaskSchema>;
const FormComponent = ({ className }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const form = useForm<FormType>({
    resolver: zodResolver(createTaskSchema),
  });
  const onSubmit = (values: FormType) => {
    console.log(values);
  };
  return (
    <Card className={cn("md:w-3/5 mx-10 md:m-auto", className)}>
      <CardHeader className="text-3xl">
        <CardTitle className="text-center">Create a task</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      // disabled={isLoading}
                      className="bg-zinc-300/50 border-0 text-black"
                      placeholder="Enter Title for the Task"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input
              multiple
              accept="image/*"
              onChange={(e) => console.log(e.target.files)}
              type="file"
              ref={ref}
              className="hidden"
            />
            <Button
              onClick={() => ref.current?.click()}
              type="button"
              className="rounded-full focus:border-2 focus:border-red-300 bg-zinc-800 text-zinc-200 duration-300 hover:text-zinc-800">
              + Upload Images
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormComponent;
