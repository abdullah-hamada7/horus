"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BFCacheHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Ensure scroll position is reset to top on route load
    window.scrollTo(0, 0);

    // 2. Handle browser Back/Forward Cache (bfcache) restore events
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Force a full reload to fix broken hydration, animations, and black sections
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname]);

  return null;
}
