import { useEffect } from "react";
import { APP_TITLE } from "../constants";

export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    if (!title) {
      document.title = APP_TITLE;
      return;
    }

    document.title = title;
    return () => {
      document.title = APP_TITLE;
    };
  }, [title]);
};
