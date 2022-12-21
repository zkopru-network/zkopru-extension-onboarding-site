import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import styles from "../styles/Deposit.module.css";
import { useRegisteredERC20s } from "../hooks/erc20";
import { hooks, metaMask } from "../connectors/metamask";
import ConnectButton from "../components/ConnectButton";
import { useRegisterErc721 } from "../hooks/zkopru";

type FormData = {
  address: string;
};

const RegisterERC721Page: NextPage = () => {
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

  const [registering, setRegistering] = useState(false);
  const registerToken = useRegisterErc721();

  const submit = handleSubmit(async (data) => {
    if (!data.address) return;

    setRegistering(true);
    await registerToken.mutateAsync(data);
    setRegistering(false);
  });

  const renderSubmitButton = () => {
    if (!isActive) return <ConnectButton />;
    if (registering) return <span>Registering...</span>;

    return (
      <button type="submit" className={styles.mainButton}>
        Register
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register ERC721</h1>
      <form onSubmit={submit}>
        <div className={styles.formControl}>
          <label htmlFor="token">Token Address</label>
          <input {...register("address")} className={styles.value} />
        </div>
        <div className={styles.formControl}>{renderSubmitButton()}</div>
      </form>
    </div>
  );
};

export default RegisterERC721Page;
