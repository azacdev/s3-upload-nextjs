"use client";

import { useState } from "react";
import { Upload, Check } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const data = await response.json();

      toast({
        title: "File uploaded successfully to S3",
        description: `File name: ${data.fileName}`,
      });
    } catch (error) {
      console.log(error);

      toast({
        variant: "destructive",
        title: "Upload to S3 failed",
        description: "There was an error uploading your file to S3.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-card rounded-lg shadow-lg">
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Choose a file to upload to S3
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Any file up to 10MB
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {file && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Selected File for S3 Upload:
          </h3>
          <div className="flex items-center p-2 bg-muted rounded">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-muted-foreground">{file.name}</span>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mb-6">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {uploadProgress}% uploaded to S3
          </p>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? "Uploading to S3..." : "Upload File to S3"}
      </Button>
    </div>
  );
}
