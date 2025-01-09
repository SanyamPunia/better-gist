"use client";

import { notFound } from "next/navigation";
import { getSnippet } from "@/app/actions";
import { CodeEditor } from "@/components/code-editor";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SnippetPage({ params }: PageProps) {
  const [files, setFiles] = useState<
    { name: string; content: string }[] | null
  >(null);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  useEffect(() => {
    async function fetchSnippet() {
      const { id } = await params;
      const fetchedFiles = await getSnippet(id);
      if (!fetchedFiles || fetchedFiles.length === 0) {
        notFound();
      }
      setFiles(fetchedFiles);
      setCurrentFileName(fetchedFiles[0].name);
    }
    fetchSnippet();
  }, [params]);

  useEffect(() => {
    document.title = currentFileName
      ? `${currentFileName} | better-gist`
      : "snippet | better-gist";
  }, [currentFileName]);

  if (!files) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-[32rem] max-w-full px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-white">Shared Snippet</h1>

          <a href={process.env.NEXT_PUBLIC_BASE_URL} target="_blank">
            <span className="rounded-full px-2 flex items-center gap-1 py-1 text-xs text-white bg-none border-2 border-border/25 font-medium transition-all hover:border-border/40 cursor-pointer">
              Create new snippet
              <ArrowUpRight className="size-3" />
            </span>
          </a>
        </div>
        <CodeEditor
          initialFiles={files}
          isReadOnly={true}
          onFileChange={setCurrentFileName}
          disableFileNameInput={true}
        />
      </div>
    </div>
  );
}
