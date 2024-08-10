import axios from "axios";
import { getCookie } from "cookies-next";

export const api = axios.create({
  // baseURL: "https://api.inpaonline.com.br",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetcher = async (url: string) => {
  console.log("### GET " + url);
  const token = getCookie("inpatoken");
  return api
    .get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};
