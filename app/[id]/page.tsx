import { notFound } from "next/navigation";
import { getSnippet } from "../actions";
import { ViewSnippet } from "@/components/view-snippet";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SnippetPage({ params }: PageProps) {
  const { id } = await params;

  const snippet = await getSnippet(id);

  if (!snippet) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-[32rem] max-w-full">
        <ViewSnippet code={snippet.code} language={snippet.language} />
      </div>
    </div>
  );
}
