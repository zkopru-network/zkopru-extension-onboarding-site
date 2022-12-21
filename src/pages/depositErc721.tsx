import { useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { utils } from "ethers";
import styles from "../styles/Deposit.module.css";
import { erc721Hooks, useRegisteredERC721s } from "../hooks/erc721";
import { hooks, metaMask } from "../connectors/metamask";
import ConnectButton from "../components/ConnectButton";
import { useL1Address } from "../hooks/zkopru";

const DEPOSIT_ERC721_EVENT = "ZKOPRU#DEPOSIT_ERC721";

type FormData = {
  fee: number;
  token: string;
  tokenId: number;
};

const DepositErc721Page: NextPage = () => {
  useEffect(() => {
    metaMask.connectEagerly();
  }, []);

  const { useIsActive, useIsActivating } = hooks;
  const isActive = useIsActive();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const fieldData = watch();

  const l1AddressQuery = useL1Address();
  const tokensQuery = useRegisteredERC721s();
  const { useERC721Approve, useERC721GetApproved } = erc721Hooks;
  const erc721Approved = useERC721GetApproved(
    fieldData.token,
    fieldData.tokenId
  );
  const erc721Approve = useERC721Approve(fieldData.token, fieldData.tokenId);

  const isLoading = useMemo(() => {
    return (
      tokensQuery.isLoading ||
      erc721Approved.isLoading ||
      l1AddressQuery.isLoading
    );
  }, [tokensQuery, erc721Approved, l1AddressQuery]);

  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const isApproved = useMemo(() => {
    if (isLoading) return false;
    if (!fieldData.tokenId) return false;
    if (!fieldData.token) return false;
    if (!erc721Approved.data) return false;

    return erc721Approved.data === l1AddressQuery.data;
  }, [isLoading, fieldData, erc721Approved.data, l1AddressQuery.data]);

  const approve = useCallback(
    async (data: FormData) => {
      if (!l1AddressQuery.data) return;
      setApproving(true);
      const tx = await erc721Approve.mutateAsync({
        spender: l1AddressQuery.data,
        tokenId: data.tokenId,
      });
      await tx.wait();
      setApproving(false);
    },
    [tokensQuery.data, l1AddressQuery.data, erc721Approve]
  );

  const deposit = useCallback(
    async (data: FormData) => {
      setDepositing(true);
      if (!isApproved) throw new Error("ERC721 not approved");
      const submitData = {
        tokenId: data.tokenId.toString(),
        fee: utils.parseEther(data.fee.toString()).toString(),
        address: data.token,
      };
      window.dispatchEvent(
        new CustomEvent(DEPOSIT_ERC721_EVENT, {
          detail: { data: submitData },
        })
      );
      setDepositing(false);
    },
    [isApproved, tokensQuery.data]
  );

  const submit = handleSubmit(async (data) => {
    if (isApproved) {
      deposit(data);
    } else {
      approve(data);
    }
  });

  const renderSubmitButton = () => {
    if (!isActive) return <ConnectButton />;
    if (approving) return <span>Approving...</span>;
    if (depositing) return <span>Depositing...</span>;

    return (
      <button type="submit" className={styles.mainButton}>
        {isApproved ? "Deposit" : "Approve"}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deposit NFT</h1>
      <form onSubmit={submit}>
        <div className={styles.formControl}>
          <label htmlFor="token">Token</label>
          <select {...register("token")} className={styles.value}>
            {tokensQuery.data?.map((token) => (
              <option key={token.symbol} value={token.address}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formControl}>
          <label htmlFor="tokenId">Token ID</label>
          <input
            className={clsx(styles.value, errors.fee && styles.error)}
            {...register("tokenId", { required: true, valueAsNumber: true })}
          />
          {errors.tokenId && <p className={styles.error}>Required Field</p>}
        </div>

        <div className={styles.formControl}>
          <label htmlFor="fee">Fee (ETH)</label>
          <input
            className={clsx(styles.value, errors.fee && styles.error)}
            {...register("fee", { required: true, valueAsNumber: true })}
          />
          {errors.fee && <p className={styles.error}>Required Field</p>}
        </div>

        <div className={styles.formControl}>{renderSubmitButton()}</div>
      </form>
    </div>
  );
};

export default DepositErc721Page;
