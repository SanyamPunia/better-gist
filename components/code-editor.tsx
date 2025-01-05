"use client";

import React, { JSX, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { WindowControls } from "./window-controls";
import { EditorView } from "@codemirror/view";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Share, Check } from "lucide-react";
import { shareSnippet } from "@/app/actions";
import { FileIcon, defaultStyles } from "react-file-icon";
import { core } from "@/theme";

export function CodeEditor({
  initialCode = "// Write your code here",
  initialFileName = "untitled.js",
  isReadOnly = false,
}: {
  initialCode?: string;
  initialFileName?: string;
  isReadOnly?: boolean;
}) {
  const [code, setCode] = useState(initialCode);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [shareStatus, setShareStatus] = useState<"idle" | "shared">("idle");
  const [fileName, setFileName] = useState(initialFileName);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const getFileIcon = (extension: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      js: <FileIcon extension="js" {...defaultStyles.js} />,
      ts: <FileIcon extension="ts" {...defaultStyles.ts} />,
      html: <FileIcon extension="html" {...defaultStyles.html} />,
      css: <FileIcon extension="css" {...defaultStyles.css} />,
      json: <FileIcon extension="json" {...defaultStyles.json} />,
    };
    return (
      iconMap[extension] || (
        <FileIcon extension={extension} {...defaultStyles.txt} />
      )
    );
  };

  const handleShare = async () => {
    const link = await shareSnippet(code, fileName);
    await navigator.clipboard.writeText(link);
    setShareStatus("shared");
    setToastMessage("URL copied to clipboard");
    setTimeout(() => setShareStatus("idle"), 2000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopyStatus("copied");
    setToastMessage("Code copied to clipboard");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
      <WindowControls />
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center flex-grow">
          <div className="w-4 h-4 mr-2">
            {getFileIcon(getFileExtension(fileName))}
          </div>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent text-zinc-300 text-sm focus:outline-none w-full"
            disabled={isReadOnly}
          />
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={handleCopy}
            className="text-zinc-400 hover:text-zinc-200 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          {!isReadOnly && (
            <motion.button
              onClick={handleShare}
              className="text-zinc-400 hover:text-zinc-200 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {shareStatus === "idle" ? (
                  <Share key="share" className="h-4 w-4" />
                ) : (
                  <motion.div
                    key="shared"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>
      <CodeMirror
        value={code}
        height="400px"
        theme={core}
        editable={!isReadOnly}
        extensions={[
          javascript(),
          EditorView.lineWrapping,
          EditorView.theme({
            "&": {
              fontSize: "12px",
            },
            ".cm-scroller": {
              padding: "16px",
            },
            "&.cm-focused": {
              outline: "none",
            },
            ".cm-gutters": {
              display: "none",
            },
            "&.cm-editor": {
              border: "none",
            },
            ".cm-content": {
              caretColor: "white",
            },
            "&.cm-focused .cm-cursor": {
              borderLeftColor: "white",
            },
            ".cm-activeLine": {
              backgroundColor: "transparent",
            },
            "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
              {
                backgroundColor: "#036dd626",
              },
            ".cm-scrollbar": {
              display: "none",
            },
          }),
        ]}
        onChange={(value) => setCode(value)}
        className="overflow-hidden font-mono text-xs outline-none bg-none"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          autocompletion: false,
        }}
      />

      <div className="text-xs text-zinc-500 px-3 py-2 border-t border-zinc-800">
        Note: Shared snippets are automatically deleted after{" "}
        <span className="underline underline-offset-2">some days</span>.
      </div>
    </div>
  );
}
