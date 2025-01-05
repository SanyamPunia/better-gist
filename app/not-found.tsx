import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen lowercase text-white">
      <div className="flex gap-4 justify-center items-center">
        <h1 className="text-center font-medium text-sm font-mono">
          This page doesn&apos;t exist.
        </h1>

        <div className="h-6 border-l-2 border-border/25 mx-4" />

        <a href={process.env.NEXT_PUBLIC_BASE_URL} target="_blank">
          <span className="rounded-full px-2 flex items-center gap-1 py-1 text-xs text-white bg-none border-2 border-border/25 font-medium transition-all hover:border-border/40 cursor-pointer">
            Create new snippet
            <ArrowUpRight className="size-3" />
          </span>
        </a>
      </div>
    </div>
  );
}
