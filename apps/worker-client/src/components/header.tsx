import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggler";

const Header = () => {
  return (
    <>
      <div className="flex w-full justify-between items-center px-6 py-3 border-b-2 shadow-gray-600 shadow-md border-gray-300">
        <p>Worker 3 User </p>
        <div className="flex justify-center items-center gap-x-4">
          <ModeToggle />
          <Button variant="default">Connect Wallet</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
