"use server";

import { supabase } from "@/lib/supabase";
import { UniqueForge } from "unique-forge";

export async function shareSnippet(
  code: string,
  fileName: string
): Promise<string> {
  const forge = new UniqueForge();
  const id = forge.generate();

  const { error } = await supabase
    .from("snippets")
    .insert({ id, code, file_name: fileName });

  if (error) {
    console.error("Error inserting snippet:", error);
    throw new Error("Failed to share snippet");
  }

  return `${process.env.NEXT_PUBLIC_BASE_URL}/snippet/${id}`;
}

export async function getSnippet(
  id: string
): Promise<{ code: string; fileName: string } | null> {
  const { data, error } = await supabase
    .from("snippets")
    .select("code, file_name")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching snippet:", error);
    return null;
  }

  return data ? { code: data.code, fileName: data.file_name } : null;
}
