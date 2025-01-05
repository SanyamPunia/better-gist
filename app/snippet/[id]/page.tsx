import { notFound } from "next/navigation";
import { getSnippet } from "@/app/actions";
import { CodeEditor } from "@/components/code-editor";
import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "snippet | better-gist",
};

export default async function SnippetPage({ params }: PageProps) {
  const { id } = await params;
  const snippet = await getSnippet(id);

  if (!snippet) {
    notFound();
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
          initialCode={snippet.code}
          initialFileName={snippet.fileName}
          isReadOnly={true}
        />
      </div>
    </div>
  );
}
