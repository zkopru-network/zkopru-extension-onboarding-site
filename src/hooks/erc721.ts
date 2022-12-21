import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { hooks } from "../connectors/metamask";
import rpcClient from "../rpcClient";

export const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
];

export function useRegisteredERC721s() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:5000"
  );

  return useQuery<{ name: string; symbol: string; address: string }[]>(
    ["erc721tokens"],
    async () => {
      const res = await rpcClient.getRegisteredTokens();
      if (!res.data) throw new Error("No data returned");
      const tokens = res.data.result;

      return await Promise.all(
        tokens.erc721s.map(async (address: string) => {
          const contract = new ethers.Contract(address, abi, provider);
          const [symbol, name] = [
            await contract.symbol(),
            await contract.name(),
          ];
          return { symbol, name, address };
        })
      );
    }
  );
}

type ApproveData = { spender: string; tokenId: number };

export function useERC721Approve(address: string, tokenId: number) {
  const { useIsActive, useAccount, useProvider } = hooks;
  const isActive = useIsActive();
  const account = useAccount();
  const provider = useProvider();

  return useMutation<TransactionResponse, unknown, ApproveData>(
    ({ spender, tokenId }): Promise<TransactionResponse> => {
      if (!isActive || !account) throw new Error("Not activated");

      const contract = new ethers.Contract(address, abi, provider?.getSigner());
      return contract.approve(spender, tokenId);
    }
  );
}

export function useERC721GetApproved(address: string, tokenId: number) {
  const { useIsActive, useAccount, useProvider } = hooks;
  const isActive = useIsActive();
  const account = useAccount();
  const provider = useProvider();

  return useQuery(
    ["getApproved", address, tokenId],
    async () => {
      const contract = new ethers.Contract(address, abi, provider);
      return await contract.getApproved(tokenId);
    },
    {
      enabled: isActive && !!account,
    }
  );
}

export const erc721Hooks = {
  useERC721Approve,
  useERC721GetApproved,
};
