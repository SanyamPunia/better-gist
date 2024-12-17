"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { SyntaxHighlighter } from "./syntax-highlighter";

interface ViewSnippetProps {
  code: string;
  language: string;
}

export function ViewSnippet({ code, language }: ViewSnippetProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <motion.div
      className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 p-2">
        <span className="text-zinc-400 text-xs">{language}</span>
        <motion.button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-zinc-200 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {copyStatus === "idle" ? (
              <Copy key="copy" className="h-4 w-4" />
            ) : (
              <motion.div
                key="copied"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <div className="h-80 relative overflow-auto">
        <SyntaxHighlighter code={code} language={language} />
      </div>
    </motion.div>
  );
}
