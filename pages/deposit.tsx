import { NextPage } from "next";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import styles from "../styles/Deposit.module.css";

const DEPOSIT_EVENT = "ZKOPRU#DEPOSIT_ETH";

type FormData = {
  amount: number;
  fee: number;
};

const DepositPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const deposit = handleSubmit(async (data) => {
    console.log("deposit", data);
    // TODO: use some form library for better typing
    window.dispatchEvent(new CustomEvent(DEPOSIT_EVENT, { detail: { data } }));
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deposit Ether</h1>
      <form onSubmit={deposit}>
        <div className={styles.formControl}>
          <label htmlFor="amount">Amount</label>
          <input
            className={clsx(styles.value, errors.fee && styles.error)}
            {...register("amount", { required: true, valueAsNumber: true })}
          />
          {errors.amount && <p className={styles.error}>Required Field</p>}
        </div>

        <div className={styles.formControl}>
          <label htmlFor="fee">Fee</label>
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
