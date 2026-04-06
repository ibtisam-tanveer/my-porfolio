import type { MetadataRoute } from "next";
import { siteDescription, siteTitle } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteTitle,
        short_name: "Ibtisam Tanveer",
        description: siteDescription,
        start_url: "/",
        display: "standalone",
        background_color: "#0c1624",
        theme_color: "#0c1624",
        icons: [
            {
                src: "/favicon.svg",
                type: "image/svg+xml",
                sizes: "any",
            },
        ],
    };
}
