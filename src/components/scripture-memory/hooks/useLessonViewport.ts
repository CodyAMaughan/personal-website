import { useEffect, useState } from "react";

export function useLessonViewport() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const viewport = window.visualViewport;

    function syncHeight() {
      setHeight(Math.round(viewport?.height ?? window.innerHeight));
    }

    syncHeight();
    viewport?.addEventListener("resize", syncHeight);
    viewport?.addEventListener("scroll", syncHeight);
    window.addEventListener("resize", syncHeight);

    return () => {
      viewport?.removeEventListener("resize", syncHeight);
      viewport?.removeEventListener("scroll", syncHeight);
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  return height;
}
