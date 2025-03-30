"use client";

import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/code-editor";
import { motion } from "framer-motion";
import { getSnippetCount } from "./actions";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/skeleton";

export default function Home() {
  const [snippetCount, setSnippetCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSnippetCount() {
      try {
        const count = await getSnippetCount();
        setSnippetCount(count);
      } catch (error) {
        console.error("Failed to fetch snippet count:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSnippetCount();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-[32rem] max-w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* {isLoading ? (
            <div className="flex items-center justify-end gap-1 mb-2">
              <Skeleton className="h-4 w-56 rounded-full bg-zinc-800" />
            </div>
          ) : (
            snippetCount !== null && (
              <div className="flex items-center justify-end gap-1 mb-2 text-secondary/90 text-xs">
                over{" "}
                <span className="flex items-center gap-1 font-bold border-2 text-secondary border-gray-50/20 rounded-sm px-1 py-0.5">
                  {snippetCount.toLocaleString()}
                  <TrendingUp className="size-3" />
                </span>{" "}
                snippets created and shared
              </div>
            )
          )} */}
          <CodeEditor />
        </motion.div>
      </div>
    </div>
  );
}
