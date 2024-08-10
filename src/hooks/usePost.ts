/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import { useState } from "react";
import Cookies from "universal-cookie";
import { api } from "../utils/api";
import * as Sentry from "@sentry/react";

export function usePost(url: string, onSuccess?: any) {
  const [data, setData] = useState<any>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const cookies = new Cookies();
  async function handlePost(data: any) {
    try {
      setError(null);
      setData([]);
      console.log(`######## API POST ${url}`);

      setIsFetching(true);
      const token = getCookie("inpatoken");
      const response = await api.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response);
      onSuccess && onSuccess();
    } catch (err) {
      const scope = new Sentry.Scope();
      console.log("POST ERROR", err);
      scope.setTag("section", "usePost").setLevel("warning");
      setError(err);
      Sentry.captureException(err, scope);
    } finally {
      setIsFetching(false);
    }
  }

  return [handlePost, data, error, isFetching];
}
