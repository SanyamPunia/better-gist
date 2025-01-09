import React, { JSX } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Trash2 } from "lucide-react";
import { getFileExtension } from "@/lib/utils";
import { FileTabProps } from "../types/editor";

export const FileTab: React.FC<FileTabProps> = ({
  file,
  index,
  isActive,
  isReadOnly,
  disableFileNameInput,
  onFileClick,
  onFileNameChange,
  onFileDelete,
}) => {
  const getFileIcon = (extension: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      js: <FileIcon extension="js" {...defaultStyles.js} />,
      jsx: <FileIcon extension="jsx" {...defaultStyles.jsx} />,
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

  return (
    <div
      className={`flex items-center mr-1 px-1.5 py-0.5 rounded cursor-pointer text-sm ${
        isActive ? "bg-zinc-800" : ""
      }`}
      onClick={() => onFileClick(index)}
    >
      <div className="w-3 h-3 mr-1">
        {getFileIcon(getFileExtension(file.name))}
      </div>
      <input
        type="text"
        value={file.name}
        onChange={(e) => onFileNameChange(index, e.target.value)}
        className={`bg-transparent text-zinc-300 text-xs focus:outline-none max-w-[100px] truncate ${
          disableFileNameInput ? "pointer-events-none" : ""
        }`}
        disabled={isReadOnly}
        placeholder="untitled.js"
      />
      {!isReadOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFileDelete(index);
          }}
          className="ml-1 text-zinc-400 hover:text-zinc-200 focus:outline-none"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
