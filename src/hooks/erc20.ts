import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { hooks } from "../connectors/metamask";
import rpcClient from "../rpcClient";

export const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

export function useRegisteredERC20s() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:5000"
  );

  return useQuery<{ decimals: number; symbol: string; address: string }[]>(
    ["tokens"],
    async () => {
      const res = await rpcClient.getRegisteredTokens();
      if (!res.data) throw new Error("No data returned");
      const tokens = res.data.result;

      return await Promise.all(
        tokens.erc20s.map(async (address: string) => {
          const contract = new ethers.Contract(address, abi, provider);
          const [symbol, decimals] = [
            await contract.symbol(),
            await contract.decimals(),
          ];
          return { symbol, decimals, address };
        })
      );
    }
  );
}

type ApproveData = { spender: string; amount: string };

export function useERC20Approve(address: string) {
  const { useIsActive, useAccount, useProvider } = hooks;
  const isActive = useIsActive();
  const account = useAccount();
  const provider = useProvider();

  return useMutation<TransactionResponse, unknown, ApproveData>(
    ({ spender, amount }): Promise<TransactionResponse> => {
      if (!isActive || !account) throw new Error("Not activated");

      const contract = new ethers.Contract(address, abi, provider?.getSigner());
      return contract.approve(spender, amount);
    }
  );
}

export function useERC20Allowance(
  erc20Address: string,
  spender: string | undefined
) {
  const { useIsActive, useAccount, useProvider } = hooks;
  const isActive = useIsActive();
  const account = useAccount();
  const provider = useProvider();

  return useQuery(
    ["allowance", erc20Address, account],
    async () => {
      const contract = new ethers.Contract(erc20Address, abi, provider);
      return await contract.allowance(account, spender);
    },
    {
      enabled: isActive && !!account && !!spender,
    }
  );
}

export function useERC20Balance(address: string) {
  const { useIsActive, useAccount, useProvider } = hooks;
  const isActive = useIsActive();
  const account = useAccount();
  const provider = useProvider();

  return useQuery(
    ["balance", address, account],
    async () => {
      const contract = new ethers.Contract(address, abi, provider);
      return await contract.balanceOf(account);
    },
    {
      enabled: isActive && !!account,
    }
  );
}

export const erc20Hooks = {
  useERC20Balance,
  useERC20Allowance,
  useERC20Approve,
};
