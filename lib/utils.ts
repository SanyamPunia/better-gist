export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const detectFunctionName = (content: string): string | null => {
  const functionRegex = /function\s+(\w+)\s*\(/;
  const match = content.match(functionRegex);
  return match ? match[1] : null;
};
