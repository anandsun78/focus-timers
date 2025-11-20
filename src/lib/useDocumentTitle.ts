import { useEffect } from "react";

export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    if (!title) {
      document.title = "Timers";
      return;
    }

    document.title = title;
    return () => {
      document.title = "Timers";
    };
  }, [title]);
};
