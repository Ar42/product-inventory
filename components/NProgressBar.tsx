// app/components/NProgressBar.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export const NProgressBar = () => {
  const pathname = usePathname();
  const previousPath = useRef<string>("");

  useEffect(() => {
    if (previousPath.current !== pathname) {
      NProgress.start();
      previousPath.current = pathname;
    }

    // small timeout to simulate end of transition
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300); // adjust to taste

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};
