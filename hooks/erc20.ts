import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export function useRegisteredERC20s() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:5000"
  );

  return useQuery<{ decimals: number; symbol: string; address: string }[]>(
    ["tokens"],
    async () => {
      const endpoint = "http://127.0.0.1:8888";
      const res = await axios.post(endpoint, {
        jsonrpc: "2.0",
        method: "l2_getRegisteredTokens",
      });
      if (!res.data) throw new Error("No data returned");
      const tokens = res.data.result;
      console.log(tokens);

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
