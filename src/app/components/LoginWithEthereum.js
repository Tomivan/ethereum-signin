"use client"; 

import { useState } from "react";
import { ethers } from "ethers";
import styles from "../page.module.css";

export default function LoginWithEthereum() {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const signInWithEthereum = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request accounts from the user
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Get user's Ethereum address
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        // Prepare message to sign
        const message = `Sign in with Ethereum to your app: ${userAddress}`;
        const signature = await signer.signMessage(message);

        // Send signed message and address to the backend for verification
        const response = await fetch("/api/auth/ethereum", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: userAddress,
              signature,
            }),
          });
        
          const data = await response.json();
          if (response.ok) {
            // Store JWT token in localStorage or cookies
            localStorage.setItem("token", data.token);
            console.log("Signed in with Ethereum!");
          } else {
            throw new Error("Authentication failed");
          }
        }
    } catch (e) {
      console.error(e);
      setError("Error signing in with Ethereum.");
    }
  };

  return (
    <div>
      {address ? (
        <p>Signed in as {address}</p>
      ) : (
        <button onClick={signInWithEthereum} className={styles.signin}>Sign in with Ethereum</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
