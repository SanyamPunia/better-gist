"use client";

import React, { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { AlertCircle, Plus } from "lucide-react";
import { shareSnippet } from "@/app/actions";
import { core } from "@/theme";
import { WindowControls } from "./window-controls";
import { FileTab } from "./file-tab";
import { ActionButtons } from "./action-buttons";
import Footer from "./footer";
import { File } from "../types/editor";
import { detectFunctionName } from "@/lib/utils";
import { ReCaptcha } from "./recaptcha"

interface CodeEditorProps {
  initialFiles?: File[];
  isReadOnly?: boolean;
  onFileChange?: (fileName: string) => void;
  disableFileNameInput?: boolean;
}

export function CodeEditor({
  initialFiles,
  isReadOnly = false,
  onFileChange,
  disableFileNameInput = false,
}: CodeEditorProps) {
  const [files, setFiles] = useState<File[]>(
    initialFiles || [
      { name: "untitled.js", content: "// Write your code here" },
    ]
  );
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [shareStatus, setShareStatus] = useState<"idle" | "loading" | "shared" | "error">("idle")
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [showRecaptcha, setShowRecaptcha] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (onFileChange) {
      onFileChange(files[activeFileIndex].name);
    }
  }, [activeFileIndex, files, onFileChange]);


  const handleRecaptchaChange = (token: string) => {
    setRecaptchaToken(token)
  }

  const handleShare = async () => {
    if (showRecaptcha && !recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA verification")
      return
    }

    setShareStatus("loading");
    try {
      const link = await shareSnippet(files, recaptchaToken)
      await navigator.clipboard.writeText(link);
      setShareStatus("shared");
      setShowRecaptcha(false)
      setRecaptchaToken("")

    } catch (error) {
      console.error("Error sharing snippet:", error);
      setShareStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to share snippet")

      if (error instanceof Error && error.message.includes("reCAPTCHA")) {
        setShowRecaptcha(true)
      }
    }
    setTimeout(() => {
      if (shareStatus === "shared" || shareStatus === "error") {
        setShareStatus("idle")
        setErrorMessage("")
      }
    }, 3000)
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(files[activeFileIndex].content);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const addNewFile = () => {
    const newFileName = `untitled${files.length + 1}.js`;
    setFiles([
      ...files,
      { name: newFileName, content: "// Write your code here" },
    ]);
    setActiveFileIndex(files.length);
  };

  const updateFileName = (index: number, newName: string) => {
    const updatedFiles = [...files];
    updatedFiles[index].name = newName;
    setFiles(updatedFiles);
    if (onFileChange && index === activeFileIndex) {
      onFileChange(newName);
    }
  };

  const updateFileContent = useCallback(
    (index: number, newContent: string) => {
      const updatedFiles = [...files];
      updatedFiles[index].content = newContent;

      // detect file name
      const detectedName = detectFunctionName(newContent);
      if (detectedName && updatedFiles[index].name.startsWith("untitled")) {
        updatedFiles[index].name = `${detectedName}.js`;
      }

      setFiles(updatedFiles);
    },
    [files]
  );

  const deleteFile = (index: number) => {
    if (files.length > 1) {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (activeFileIndex >= newFiles.length) {
        setActiveFileIndex(newFiles.length - 1);
      } else if (activeFileIndex > index) {
        setActiveFileIndex(activeFileIndex - 1);
      }
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
      <WindowControls />
      <div className="flex items-center px-2 py-1 border-b border-zinc-800 overflow-x-auto">
        {files.map((file, index) => (
          <FileTab
            key={index}
            file={file}
            index={index}
            isActive={index === activeFileIndex}
            isReadOnly={isReadOnly}
            disableFileNameInput={disableFileNameInput}
            onFileClick={setActiveFileIndex}
            onFileNameChange={updateFileName}
            onFileDelete={files.length > 1 ? deleteFile : undefined}
          />
        ))}
        {!isReadOnly && (
          <button
            onClick={addNewFile}
            className="text-zinc-400 hover:text-zinc-200 focus:outline-none ml-1"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      <ActionButtons
        isReadOnly={isReadOnly}
        onCopy={handleCopy}
        onShare={handleShare}
        copyStatus={copyStatus}
        shareStatus={shareStatus}
      />

      {showRecaptcha && !isReadOnly && (
        <div className="border-t border-zinc-800 p-4">
          <ReCaptcha siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} onChange={handleRecaptchaChange} />
          {errorMessage && (
            <div className="flex items-center justify-center text-red-500 text-xs mt-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errorMessage}
            </div>
          )}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleShare}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded px-4 py-2 focus:outline-none"
              disabled={!recaptchaToken || shareStatus === "loading"}
            >
              {shareStatus === "loading" ? "Sharing..." : "Confirm Share"}
            </button>
          </div>
        </div>
      )}

      {shareStatus === "error" && !showRecaptcha && (
        <div className="flex items-center justify-center text-red-500 text-xs p-2 border-t border-zinc-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errorMessage || "Failed to share snippet. Please try again."}
        </div>
      )}
      
      <CodeMirror
        value={files[activeFileIndex].content}
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
        onChange={(value) => updateFileContent(activeFileIndex, value)}
        className="overflow-hidden font-mono text-xs outline-none bg-none"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          autocompletion: false,
        }}
      />
      <Footer />
    </div>
  );
}
