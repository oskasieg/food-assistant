import { useEffect, useState } from "react";

export default function useHiddenComponent(delay: number) {
  const [hidden, setHidden] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setHidden(false);
    }, delay);
  }, [delay]);

  return hidden;
}
