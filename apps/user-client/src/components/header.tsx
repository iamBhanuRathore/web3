// import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggler,";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;
  }, [publicKey]);
  return (
    <>
      <div className="flex w-full justify-between items-center px-6 py-3 border-b-2 shadow-gray-600 shadow-md border-gray-300">
        <p>Web 3 User </p>
        <div className="flex justify-center items-center gap-x-4">
          <ModeToggle />
          <WalletMultiButton className="flex items-center justify-center " />
        </div>
      </div>
    </>
  );
};

export default Header;
