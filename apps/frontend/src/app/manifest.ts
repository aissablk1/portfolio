import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aïssa Belkoussa — Architecte de systemes & Automation",
    short_name: "Aïssa Belkoussa",
    description:
      "Architecture de systemes, automation et developpement digital sur-mesure.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
