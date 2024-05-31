import { ModeToggle } from "./theme-toggler.tsx";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { BACKEND_URL } from "@/constants";

const Header = () => {
  const { publicKey, signMessage } = useWallet();

  const signInMessage = async (
    key: PublicKey,
    signMessage: (message: Uint8Array) => Promise<Uint8Array>
  ) => {
    const message = new TextEncoder().encode(
      `${window.location.host} wants you to sign in with your Solana account:\n${key.toBase58()}\n\nPlease sign in.`
    );

    try {
      const signature = await signMessage(message);

      if (!ed25519.verify(signature, message, key.toBytes())) {
        alert("This signature is Invalid !");
        return;
      }

      const { data } = await axios.post(`${BACKEND_URL}/user/signin`, {
        walletAddress: Buffer.from(signature).toString("base64"), // Send signature as base64
        publicKey: key.toBase58(),
      });

      localStorage.setItem("web3-user-token", data.token);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  useEffect(() => {
    if (publicKey && signMessage) {
      signInMessage(publicKey, signMessage);
    }
  }, [publicKey, signMessage]);

  return (
    <div className="flex w-full justify-between items-center px-6 py-3 border-b-2 shadow-gray-600 shadow-md border-gray-300">
      <p>Web 3 User </p>
      <div className="flex justify-center items-center gap-x-4">
        <ModeToggle />
        <WalletMultiButton className="flex items-center justify-center " />
      </div>
    </div>
  );
};

export default Header;
