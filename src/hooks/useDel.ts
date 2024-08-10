/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import { useState } from "react";
import Cookies from "universal-cookie";
import { api } from "../utils/api";
import * as Sentry from "@sentry/react";
export function useDel(url: string, onSuccess?: any) {
  const [data, setData] = useState<any>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const cookies = new Cookies();
  async function handleDelete(data: any) {
    console.log("delete", { data });
    try {
      setError(null);
      console.log(`######## API DEL ${url}`);
      setIsDeleting(true);
      const token = getCookie("inpatoken");
      const response = await api.delete(
        typeof data === "number" ? url + data : url,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response);
      onSuccess && onSuccess();
    } catch (err) {
      Sentry.captureException(err);
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  }

  return [handleDelete, data, error, isDeleting];
  // return [handleDelete, data, error, isDeleting];
}
