/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import { useState } from "react";
import Cookies from "universal-cookie";
import { api } from "../utils/api";
import * as Sentry from "@sentry/react";
export function usePut(url: string, onSuccess?: any) {
  const [dataPut, setDataPut] = useState<any>([]);
  const [isPuting, setIsPuting] = useState<boolean>(false);
  const [errorPut, setErrorPut] = useState<any>(null);

  const cookies = new Cookies();

  async function handlePut(dataPut: any) {

    try {
      setDataPut([]);
      setErrorPut(null);
      console.log(`######## API PUT ${url}`);
      setIsPuting(true);

      const token = getCookie("inpatoken");
      const response = await api.put(url, dataPut, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataPut(response);
      onSuccess && onSuccess();
      
    } catch (err) {
      setErrorPut(err);

      Sentry.captureException(err);
    } finally {
      setIsPuting(false);
    }
  }

  return [handlePut, dataPut, errorPut, isPuting];
}
