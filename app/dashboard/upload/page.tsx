"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange called");
    const selected = e.target.files?.[0];
    console.log("Selected file:", selected);
    if (selected && selected.size <= 1024 * 1024) {
      setFile(selected);
      console.log("File accepted:", selected.name, selected.size);
    } else {
      alert("File must be less than 1MB.");
      console.warn("Rejected file due to size limit");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.warn("No file selected, upload aborted");
      return;
    }

    setUploading(true);
    setProgress(0);
    console.log("Upload started for file:", file.name);

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedFileName}`;
    console.log("Sanitized filename:", fileName);

    try {
      const { error } = await supabase.storage
      .from("neosaas")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
    

      if (error) {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
      } else {
        console.log("Upload successful:", fileName);
        setFiles((prev) => [...prev, fileName]);
        setFile(null);
      }
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      alert("Upload failed due to unexpected error.");
    }

    setProgress(100);
    setUploading(false);
    console.log("Upload finished");
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-3xl mb-2">Upload</h1>
        <p className="text-muted-foreground">Upload your files to the cloud.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={handleFileChange} />
          {file && (
            <div className="text-sm text-muted-foreground">{file.name}</div>
          )}
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          {uploading && <Progress value={progress} />}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm list-disc pl-5 space-y-1">
              {files.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
