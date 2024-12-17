import { CodeEditor } from "@/components/code-editor";
import { ViewSnippet } from "@/components/view-snippet";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-[32rem] max-w-full px-4">
        <CodeEditor />

        {/* <ViewSnippet code="const a = 5" language="CSS" /> */}
      </div>
    </div>
  );
}
