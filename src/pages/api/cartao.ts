// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function postCardToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const formattedData = req.body;

  if (req.method !== "POST")
    return res.status(200).send("Comunicação direta com o Pagar.Me");

  // return res.end("teste");
  try {
    const response = await axios.post(
      "https://api.pagar.me/core/v5/tokens?appId=pk_v1G9kgECXio6WVMQ",
      formattedData
    );
    res.send(response.data);
  } catch (err) {
    res.status(400).json(err);
  }

  // res.json(formattedData);
}
