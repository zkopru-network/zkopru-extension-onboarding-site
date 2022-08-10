import { useCallback } from "react";
import { hooks, metaMask } from "../connectors/metamask";
import styles from "./ConnectButton.module.css";

const ConnectButton = () => {
  const { useIsActive, useIsActivating } = hooks;
  const isActive = useIsActive();
  const isActivating = useIsActivating();

  const connect = useCallback(() => {
    if (isActive || isActivating) {
      // do nothing
    } else {
      metaMask.activate();
    }
  }, [isActive, isActivating]);

  return (
    <button className={styles.connectButton} onClick={connect}>
      {isActive ? "Connected" : isActivating ? "Connecting" : "Connect"}
    </button>
  );
};

export default ConnectButton;
