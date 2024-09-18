import Image from "next/image";
import styles from "./page.module.css";
import LoginWithEthereum from "./components/loginwithEthereum";

export default function Home() {
  return (
    <div className={styles.page}>
      <LoginWithEthereum />
    </div>
  );
}
