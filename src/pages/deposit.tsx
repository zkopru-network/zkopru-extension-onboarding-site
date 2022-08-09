import { useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { utils } from "ethers";
import styles from "../styles/Deposit.module.css";
import { erc20Hooks, useRegisteredERC20s } from "../hooks/erc20";
import { hooks, metaMask } from "../connectors/metamask";
import ConnectButton from "../components/ConnectButton";
import { useL1Address } from "../hooks/zkopru";

const DEPOSIT_EVENT = "ZKOPRU#DEPOSIT_ETH";
const DEPOSIT_ERC20_EVENT = "ZKOPRU#DEPOSIT_ERC20";

type FormData = {
  amount: number;
  fee: number;
  token: string;
};

const DepositPage: NextPage = () => {
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
  const tokensQuery = useRegisteredERC20s();
  const { useERC20Balance, useERC20Allowance, useERC20Approve } = erc20Hooks;
  const erc20Balance = useERC20Balance(fieldData.token);
  const erc20Allowance = useERC20Allowance(
    fieldData.token,
    l1AddressQuery.data
  );
  const erc20Approve = useERC20Approve(fieldData.token);

  const isLoading = erc20Balance.isLoading || erc20Allowance.isLoading;
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const isApproved = useMemo(() => {
    if (isLoading) return false;
    if (!fieldData.amount) return false;
    if (!erc20Allowance.data) return false;
    return utils
      .parseEther(fieldData.amount.toString())
      .lte(erc20Allowance.data);
  }, [isLoading, fieldData, erc20Allowance.data]);

  const approve = useCallback(
    async (data: FormData) => {
      if (!l1AddressQuery.data) return;
      setApproving(true);
      const amount = utils
        .parseUnits(
          data.amount.toString(),
          tokensQuery.data?.find((t) => t.address === data.token)?.decimals
        )
        .toString();

      const tx = await erc20Approve.mutateAsync({
        spender: l1AddressQuery.data,
        amount,
      });
      await tx.wait();
      setApproving(false);
    },
    [tokensQuery.data, l1AddressQuery.data, erc20Approve]
  );

  const deposit = useCallback(
    async (data: FormData) => {
      if (data.token === "ETH") {
        const submitData = {
          amount: utils.parseEther(data.amount.toString()).toString(),
          fee: utils.parseEther(data.fee.toString()).toString(),
        };
        window.dispatchEvent(
          new CustomEvent(DEPOSIT_EVENT, { detail: { data: submitData } })
        );
      } else {
        if (!isApproved) throw new Error("ERC20 not approved");
        const submitData = {
          amount: utils
            .parseUnits(
              data.amount.toString(),
              tokensQuery.data?.find((t) => t.address === data.token)?.decimals
            )
            .toString(),
          fee: utils.parseEther(data.fee.toString()).toString(),
          address: data.token,
        };
        window.dispatchEvent(
          new CustomEvent(DEPOSIT_ERC20_EVENT, {
            detail: { data: submitData },
          })
        );
      }
    },
    [isApproved, tokensQuery.data]
  );

  const submit = handleSubmit(async (data) => {
    if (data.token === "eth" || isApproved) {
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
        {isApproved || fieldData.token === "eth" ? "Deposit" : "Approve"}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deposit Ether</h1>
      {fieldData.token !== "eth" &&
        (isLoading ? (
          <span>Loading</span>
        ) : (
          <>
            <span>Balance: {erc20Balance.data?.toString() || "0"}</span>
            <span>Allowance: {erc20Allowance.data?.toString() || "0"}</span>
          </>
        ))}
      <form onSubmit={submit}>
        <div className={styles.formControl}>
          <label htmlFor="token">Token</label>
          <select {...register("token")} className={styles.value}>
            <option value="eth">ETH</option>
            {tokensQuery.data?.map((token) => (
              <option key={token.symbol} value={token.address}>
                {token.symbol} (decimals: {token.decimals})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formControl}>
          <label htmlFor="amount">Amount</label>
          <input
            className={clsx(styles.value, errors.fee && styles.error)}
            {...register("amount", { required: true, valueAsNumber: true })}
          />
          {errors.amount && <p className={styles.error}>Required Field</p>}
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

export default DepositPage;
