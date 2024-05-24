import React, { forwardRef } from "react";
import { Button } from "@repo/ui/components/ui/button";
// import { UseFieldArrayAppend } from "react-hook-form";
// import { createTaskSchema } from "@repo/schemas/schemas";
// import z from "zod";

// type FormType = z.infer<typeof createTaskSchema>;

type Props = {
  handleFileUpload: (files: FileList) => Promise<void>;
  disabled: boolean;
  //   append: UseFieldArrayAppend<FormType, "options">;
};

const UploadButton = forwardRef<HTMLInputElement, Props>(
  ({ handleFileUpload, disabled }, ref) => {
    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      if (e.target.files.length > 5) {
        alert("Cannot Select More than 5 images.");
        return;
      }
      handleFileUpload(e.target.files);
    };
    const handleUpload = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.click();
      }
    };
    return (
      <>
        <input
          multiple
          accept="image/*"
          onChange={onUpload}
          disabled={disabled}
          type="file"
          ref={ref}
          className="hidden"
        />
        <Button
          disabled={disabled}
          onClick={handleUpload}
          type="button"
          className="rounded-full focus:border-2 focus:border-red-300 bg-zinc-800 text-zinc-200 duration-300 hover:text-zinc-800">
          {disabled ? "Uploading..." : "+ Upload Images"}
        </Button>
      </>
    );
  }
);

export default UploadButton;
