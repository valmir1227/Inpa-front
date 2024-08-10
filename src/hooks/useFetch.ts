/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import { useState } from "react";
import Cookies from "universal-cookie";
import { useMyContext } from "../contexts/Context";
import { api } from "../utils/api";
import * as Sentry from "@sentry/react";
export function useFetch(url: any, options?: any, startLoading?: boolean) {
  const [data, setData] = useState<any>();
  const [isFetching, setIsFetching] = useState(startLoading);
  const [error, setError] = useState(null);

  const cookies = new Cookies();

  async function get() {
    setError(null);
    setData([]);
    setIsFetching(true);
    try {
      console.log(`######## API GET ${url}`);
      const token = getCookie("inpatoken");
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setData(response.data);
      if (response?.data.length > 0 || response?.data) {
        setData(response.data);
      } else setData(response);
    } catch (err: any) {
      Sentry.captureException(err);
      setError(err);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  }

  // console.log(url, "data", data, "error:", error), "isFetching:", isFetching;
  return [data, error, isFetching, get];
}
