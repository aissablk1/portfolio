import { cookies } from "next/headers";

export type Lang = "fr" | "en";

export async function getServerLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  if (lang === "en") return "en";
  return "fr";
}
