/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import { useState } from "react";
import Cookies from "universal-cookie";
import { api } from "../utils/api";
import * as Sentry from "@sentry/react";

export function usePatch(url: string, onSuccess?: any) {
  const [data, setData] = useState<any>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const cookies = new Cookies();

  async function handlePatch(data: any) {

    try {
      setData([]);
      setError(null);
      console.log(`######## API PATCH ${url}`);
      setIsFetching(true);
      const token = getCookie("inpatoken");
      const response = await api.patch(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err);

      Sentry.captureException(err);
    } finally {
      setIsFetching(false);
    }
  }

  console.log(url, "data", data, "error:", error), "isFetching:", isFetching;
  return [handlePatch, data, error, isFetching];
}
