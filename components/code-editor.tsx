"use client";

import { shareSnippet } from "@/app/actions";
import { detectFunctionName } from "@/lib/utils";
import { core } from "@/theme";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { AlertCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { File } from "../types/editor";
import { ActionButtons } from "./action-buttons";
import { FileTab } from "./file-tab";
import Footer from "./footer";
import { SecurityChallenge } from "./security-challenge";
import { WindowControls } from "./window-controls";

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
  const [showChallenge, setShowChallenge] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (onFileChange) {
      onFileChange(files[activeFileIndex].name);
    }
  }, [activeFileIndex, files, onFileChange]);


  const handleVerify = (verified: boolean) => {
    setIsVerified(verified)
    if (verified) {
      handleShare()
    }
  }


  const handleShare = async () => {
    if (showChallenge && !isVerified) {
      return
    }

    setShareStatus("loading");
    try {
      const link = await shareSnippet(files)
      await navigator.clipboard.writeText(link);
      setShareStatus("shared");
      setShowChallenge(false)
      setIsVerified(false)
    } catch (error) {
      console.error("Error sharing snippet:", error);
      setShareStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to share snippet")
    }
    setTimeout(() => {
      if (shareStatus === "shared" || shareStatus === "error") {
        setShareStatus("idle")
        setErrorMessage("")
      }
    }, 3000)
  };

  const initiateShare = () => {
    setShowChallenge(true)
  }


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
        onShare={showChallenge ? handleShare : initiateShare}
        copyStatus={copyStatus}
        shareStatus={shareStatus}
      />

      {showChallenge && !isReadOnly && <SecurityChallenge onVerify={handleVerify} />}

      {shareStatus === "error" && (
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
