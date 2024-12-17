"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Share, Check } from "lucide-react";
import { createSnippet } from "@/app/actions";
import { SyntaxHighlighter } from "./syntax-highlighter";
import { WindowControls } from "./window-controls";
import { BRACKETS, LANGUAGES } from "@/lib/constants";

export function CodeEditor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0].value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [shareStatus, setShareStatus] = useState<"idle" | "shared">("idle");
  const [filename, setFilename] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // handle dropdown state
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    try {
      const snippet = await createSnippet({ code, language });
      const url = `${window.location.origin}/${snippet.id}`;
      await navigator.clipboard.writeText(url);
      setShareStatus("shared");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch (error) {
      console.error("Error creating snippet", error);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (e.key === "Tab") {
      e.preventDefault();
      const newValue =
        value.substring(0, selectionStart) +
        "  " +
        value.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }

    if (BRACKETS[e.key as keyof typeof BRACKETS]) {
      e.preventDefault();
      const closingBracket = BRACKETS[e.key as keyof typeof BRACKETS];
      const newValue =
        value.substring(0, selectionStart) +
        e.key +
        closingBracket +
        value.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const lines = value.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];
      const indentation = currentLine.match(/^\s*/)?.[0] || "";
      const newValue =
        value.substring(0, selectionStart) +
        "\n" +
        indentation +
        value.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + indentation.length + 1;
      }, 0);
    }
  };

  return (
    <motion.div
      className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WindowControls />
      <div className="flex items-center justify-between border-b border-zinc-800 p-2">
        <div className="relative" ref={dropdownRef}>
          <motion.button
            className="bg-zinc-800 text-zinc-300 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-700 flex items-center min-w-[100px] justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {LANGUAGES.find((lang) => lang.value === language)?.label}
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 20 20"
              className="ml-2"
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            >
              <path
                d="M5 8l5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="absolute top-full left-0 mt-1 bg-zinc-800 rounded-md overflow-hidden shadow-lg z-10 min-w-[100px]"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {LANGUAGES.map((lang) => (
                  <motion.button
                    key={lang.value}
                    className="block w-full text-left px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                    onClick={() => {
                      setLanguage(lang.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {lang.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
        </div>
      </div>
      <div className="border-b border-zinc-800 px-3 py-1.5">
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-transparent text-xs text-zinc-400 focus:outline-none w-full"
          placeholder="[Name your file]"
        />
      </div>
      <div className="relative h-80" ref={editorRef}>
        <SyntaxHighlighter code={code} language={language} />
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        //   onKeyDown={handleKeyDown}
          className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 font-mono text-xs text-transparent caret-white outline-none"
          style={{ caretColor: "white" }}
          placeholder="Type or paste your code here..."
          spellCheck={false}
        />
      </div>
    </motion.div>
  );
}
