import { NextPage } from "next";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import styles from "../styles/Deposit.module.css";
import { useRegisteredERC20s } from "../hooks/erc20";

const DEPOSIT_EVENT = "ZKOPRU#DEPOSIT_ETH";
const DEPOSIT_ERC20_EVENT = "ZKOPRU#DEPOSIT_ERC20";

type FormData = {
  amount: number;
  fee: number;
  token: string;
};

const DepositPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const tokensQuery = useRegisteredERC20s();
  const deposit = handleSubmit(async (data) => {
    console.log("deposit", data);
    // TODO: use some form library for better typing
    if (data.token === "ETH") {
      window.dispatchEvent(
        new CustomEvent(DEPOSIT_EVENT, { detail: { data } })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent(DEPOSIT_ERC20_EVENT, { detail: { data } })
      );
    }
  });
  console.log(tokensQuery.data);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deposit Ether</h1>
      <form onSubmit={deposit}>
        <div className={styles.formControl}>
          <label htmlFor="token">Token</label>
          <select {...register("token")} className={styles.value}>
            <option value="eth">ETH</option>
            {tokensQuery.data?.map((token) => (
              <option key={token.symbol}>
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

        <div className={styles.formControl}>
          <button className={styles.mainButton} type="submit">
            Deposit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositPage;
