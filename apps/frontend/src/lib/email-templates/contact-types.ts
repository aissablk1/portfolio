export type Lang = "fr" | "en";

export interface ContactPayload {
  name: string;
  email: string;
  context: string;
  need: string;
  message: string;
  budget: string;
  lang: Lang;
  plan?: string;
  [key: string]: unknown;
}

export interface LeadScore {
  score: number;
  label: "CHAUD" | "TIEDE" | "FROID";
  color: string;
  action: string;
}
