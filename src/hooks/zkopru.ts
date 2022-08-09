import { useQuery } from "@tanstack/react-query";
import rpcClient from "../rpcClient";

export function useL1Address() {
  return useQuery<string>(["l1_address"], async () => {
    const res = await rpcClient.getL1Address();

    if (!res.data) throw new Error("No data returned");
    return res.data.result;
  });
}
