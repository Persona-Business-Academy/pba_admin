import { useEffect, useState } from "react";

export const useDebounce = (text: string, delay: number = 300) => {
  const [debounceText, setDebounceText] = useState<string>(text);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceText(text);
    }, delay);

    return () => clearTimeout(handler);
  }, [delay, text]);

  return debounceText;
};
