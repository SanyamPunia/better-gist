export interface File {
  name: string;
  content: string;
}

export interface FileTabProps {
  file: File;
  index: number;
  isActive: boolean;
  isReadOnly: boolean;
  disableFileNameInput: boolean;
  onFileClick: (index: number) => void;
  onFileNameChange: (index: number, newName: string) => void;
  onFileDelete?: (index: number) => void;
}

export interface ActionButtonsProps {
  isReadOnly: boolean;
  onCopy: () => void;
  onShare: () => void;
  copyStatus: "idle" | "copied";
  shareStatus: "idle" | "loading" | "shared" | "error";
}
