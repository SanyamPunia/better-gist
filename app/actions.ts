"use server";

import { nanoid } from "nanoid";

// in memory usage, chutiya memory usage hai, slug render nahi hota
const snippets = new Map<string, { code: string; language: string }>();

export async function createSnippet({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const id = nanoid(10);
  snippets.set(id, { code, language });

  console.log(snippets);
  return { id };
}

export async function getSnippet(id: string) {
  return snippets.get(id);
}
