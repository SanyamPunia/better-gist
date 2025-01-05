"use client";

import { CodeEditor } from "@/components/code-editor";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="w-[32rem] max-w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CodeEditor />
      </motion.div>
    </div>
  );
}
