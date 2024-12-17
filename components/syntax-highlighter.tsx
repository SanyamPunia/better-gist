"use client";

import { highlight } from "sugar-high";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const highlightedCode = highlight(code);

  return (
    <pre className="m-0 p-4 font-mono text-xs bg-transparent absolute inset-0 pointer-events-none">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode || "&nbsp;" }} />
    </pre>
  );
}
