import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import rpcClient from "../rpcClient";
import { hooks } from "../connectors/metamask";

export function useL1Address() {
  return useQuery<string>(["l1_address"], async () => {
    const res = await rpcClient.getL1Address();

    if (!res.data) throw new Error("No data returned");
    return res.data.result;
  });
}

export function useRegisterErc721() {
  const addressQuery = useL1Address();
  const { useProvider } = hooks;
  const provider = useProvider();
  const abi = ["function registerERC721(address tokenAddr)"];

  return useMutation<unknown, unknown, { address: string }>(async (data) => {
    if (!addressQuery.data) throw new Error("l1 address not loaded");
    const contract = new ethers.Contract(
      addressQuery.data,
      abi,
      provider?.getSigner()
    );

    await contract.registerERC721(data.address);
  });
}
