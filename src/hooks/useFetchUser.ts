/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useMyContext } from "../contexts/Context";
import { api, fetcher } from "../utils/api";
import useSWR from "swr";
import { useUsers } from "stores/useUser";

export function useFetchUser() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/v1/users/me",
    fetcher
  );
  const { setUserStore } = useUsers();

  useEffect(() => {
    setUserStore(data);
  }, [data]);

  return { data, error, isLoading, isValidating, mutate };
}
