"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ApiDocs() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load Swagger CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css";
    document.head.appendChild(link);

    // Load Swagger bundle JS
    const scriptBundle = document.createElement("script");
    scriptBundle.src = "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js";
    scriptBundle.async = true;
    document.body.appendChild(scriptBundle);

    // Load Swagger preset JS
    const scriptPreset = document.createElement("script");
    scriptPreset.src = "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js";
    scriptPreset.async = true;
    document.body.appendChild(scriptPreset);

    const initSwagger = () => {
      const w = window as any;
      if (w.SwaggerUIBundle && w.SwaggerUIStandalonePreset) {
        w.SwaggerUIBundle({
          url: "/api/swagger.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [
            w.SwaggerUIBundle.presets.apis,
            w.SwaggerUIStandalonePreset
          ],
          plugins: [
            w.SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout"
        });
      }
    };

    scriptPreset.onload = initSwagger;
    scriptBundle.onload = () => {
      if (scriptPreset.onload) {
        initSwagger();
      }
    };

    return () => {
      try {
        document.head.removeChild(link);
        document.body.removeChild(scriptBundle);
        document.body.removeChild(scriptPreset);
      } catch (e) {
        // Safe catch if elements were already removed
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 pt-32 pb-16 text-black" dir="ltr">
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 transition-colors">
          &larr; Back to Museum
        </Link>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div id="swagger-ui"></div>
      </div>
    </div>
  );
}
