"use server";

import { CustomUniqueForge } from "unique-forge";
import { supabase } from "@/lib/supabase";

interface File {
  name: string;
  content: string;
}

export async function shareSnippet(files: File[]): Promise<string> {
  const forge = new CustomUniqueForge({
    size: 10,
    alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  });
  const id = forge.generate();

  const { error } = await supabase
    .from("snippets")
    .insert({ id, files: JSON.stringify(files) });

  if (error) {
    console.error("Error inserting snippet:", error);
    throw new Error("Failed to share snippet");
  }

  return `${process.env.NEXT_PUBLIC_BASE_URL}/snippet/${id}`;
}

export async function getSnippet(id: string): Promise<File[] | null> {
  const { data, error } = await supabase
    .from("snippets")
    .select("files")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching snippet:", error);
    return null;
  }

  return data?.files ? JSON.parse(data.files) : null;
}

export async function getSnippetCount(): Promise<number> {
  const { count, error } = await supabase
    .from("snippets")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching snippet count:", error);
    return 0;
  }

  // round up to next hundered
  return Math.ceil((count || 0) / 100) * 100;
}
