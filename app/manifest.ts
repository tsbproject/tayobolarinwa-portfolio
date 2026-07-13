import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tayo Bolarinwa",
    short_name: "Tayo",

    description:
      "Portfolio of Tayo Samuel Bolarinwa, Full Stack Engineer specializing in scalable web applications, system architecture and modern software engineering.",

    start_url: "/",

    display: "standalone",

    background_color: "#ffffff",

    theme_color: "#2563eb",

    icons: [
      {
        src: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },

      {
        src: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}