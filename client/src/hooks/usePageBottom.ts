import { useEffect, useState } from "react";

export default function usePageBottom() {
  const [bottom, setBottom] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const isBottom =
        Math.ceil(window.innerHeight) +
          Math.ceil(document.documentElement.scrollTop) ===
        document.documentElement.offsetHeight;
      setBottom(isBottom);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return bottom;
}
